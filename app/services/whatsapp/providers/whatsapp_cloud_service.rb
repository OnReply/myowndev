class Whatsapp::Providers::WhatsappCloudService < Whatsapp::Providers::BaseService
  prepend ::Whatsapp::Providers::WhatsappCloudInteractiveMessages

  def send_message(phone_number, message)
    if message.attachments.present?
      send_attachment_message(phone_number, message)
    else
      send_text_message(phone_number, message)
    end
  end

  def send_template(phone_number, template_info)
    response = HTTParty.post(
      "#{phone_id_path}/messages",
      headers: api_headers,
      body: {
        messaging_product: 'whatsapp',
        to: phone_number,
        template: template_body_parameters(template_info),
        type: 'template'
      }.to_json
    )

    process_response(response)
  end

  def sync_templates
    templates = fetch_whatsapp_templates("#{business_account_path}/message_templates?access_token=#{whatsapp_channel.provider_config['api_key']}")

    whatsapp_channel.update(message_templates: templates, message_templates_last_updated: Time.now.utc) if templates.present?
  end

  def fetch_whatsapp_templates(url)
    response = HTTParty.get(url)
    return [] unless response.success?

    next_url = next_url(response)

    return response['data'] + fetch_whatsapp_templates(next_url) if next_url.present?

    response['data']
  end

  def next_url(response)
    response['paging'] ? response['paging']['next'] : ''
  end

  def validate_provider_config?
    response = HTTParty.get("#{business_account_path}/message_templates?access_token=#{whatsapp_channel.provider_config['api_key']}")
    response.success?
  end

  def api_headers
    { 'Authorization' => "Bearer #{whatsapp_channel.provider_config['api_key']}", 'Content-Type' => 'application/json' }
  end

  def media_url(media_id)
    "#{api_base_path}/v13.0/#{media_id}"
  end

  def create_template(template)
    response = HTTParty.post(
      "#{business_account_path}/message_templates",
      headers: api_headers,
      body: template.to_json
    )
    response
  end

  def delete_template(name)
    response = HTTParty.delete(
      "#{business_account_path}/message_templates?name=#{name}",
      headers: api_headers
    )
    response
  end

  def extend_token_life
    response = HTTParty.get("#{api_base_path}/v16.0/oauth/access_token?grant_type=fb_exchange_token&client_id=#{GlobalConfigService.load('FB_APP_ID', nil)}&client_secret=#{GlobalConfigService.load('FB_APP_SECRET', nil)}&fb_exchange_token=#{whatsapp_channel.provider_config['api_key']}")
    whatsapp_channel.provider_config['api_key'] = response["access_token"]
    whatsapp_channel.provider_config['token_expiry_date'] =  response["expires_in"].present? ? Time.current + response["expires_in"] : 'never'
    whatsapp_channel.save!
  end

  def sync_token_expiry_date
    return if whatsapp_channel.provider_config['token_expiry_date'] == 'never'
    response = get_expires_at()
    whatsapp_channel.provider_config['token_expiry_date'] = response["data"]["expires_at"] == 0 ? 'never' : Time.at(response["data"]["expires_at"]).utc
    whatsapp_channel.save!
  end

  def refresh_token
    response = HTTParty.get("#{api_base_path}/v16.0/me?access_token=#{whatsapp_channel.provider_config['api_key']}")
  end

  def get_expires_at
    res = HTTParty.get("#{api_base_path}/v16.0/debug_token?input_token=#{whatsapp_channel.provider_config["api_key"]}&access_token=#{ENV['FB_APP_ACCESS_ID']}")
    return res if res.success?
    HTTParty.get("#{api_base_path}/v16.0/debug_token?input_token=#{whatsapp_channel.provider_config["api_key"]}&access_token=#{whatsapp_channel.provider_config["api_key"]}")
  end

  def get_app_id
    res = HTTParty.get(
      "#{api_base_path}/v16.0/#{whatsapp_channel.provider_config["business_account_id"]}/subscribed_apps",
      headers: api_headers
    )
    if res.success?
      app_details = res["data"].find{ |app| app["whatsapp_business_api_data"] }
      whatsapp_channel.provider_config['app_id'] = app_details["whatsapp_business_api_data"]["id"]
      whatsapp_channel.save!
    end
  end

  private

  def api_base_path
    ENV.fetch('WHATSAPP_CLOUD_BASE_URL', 'https://graph.facebook.com')
  end

  # TODO: See if we can unify the API versions and for both paths and make it consistent with out facebook app API versions
  def phone_id_path
    "#{api_base_path}/v13.0/#{whatsapp_channel.provider_config['phone_number_id']}"
  end

  def business_account_path
    "#{api_base_path}/v14.0/#{whatsapp_channel.provider_config['business_account_id']}"
  end

  def send_text_message(phone_number, message)
    response = HTTParty.post(
      "#{phone_id_path}/messages",
      headers: api_headers,
      body: {
        messaging_product: 'whatsapp',
        to: phone_number,
        text: { body: message.content },
        type: 'text'
      }.to_json
    )

    process_response(response)
  end

  def send_attachment_message(phone_number, message)
    attachment = message.attachments.first
    type = %w[image audio video].include?(attachment.file_type) ? attachment.file_type : 'document'
    type_content = {
      'link': attachment.download_url
    }
    type_content['caption'] = message.content unless %w[audio sticker].include?(type)
    type_content['filename'] = attachment.file.filename if type == 'document'
    response = HTTParty.post(
      "#{phone_id_path}/messages",
      headers: api_headers,
      body: {
        :messaging_product => 'whatsapp',
        'to' => phone_number,
        'type' => type,
        type.to_s => type_content
      }.to_json
    )

    process_response(response)
  end

  def process_response(response)
    if response.success?
      response['messages'].first['id']
    else
      Rails.logger.error response.body
      nil
    end
  end

  def template_body_parameters(template_info)
    {
      name: template_info[:name],
      language: {
        policy: 'deterministic',
        code: template_info[:lang_code]
      },
      components: [{
        type: 'body',
        parameters: template_info[:parameters]
      }]
    }
  end
end
