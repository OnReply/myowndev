class Integrations::Csml::ProcessorService < Integrations::BotProcessorService
  pattr_initialize [:event_name!, :event_data!, :agent_bot!]
  prepend Integrations::Csml::ProcessProductsMessage

  private

  def csml_client
    @csml_client ||= CsmlEngine.new
  end

  def get_response(session_id, content)
    csml_client.run(
      bot_payload,
      {
        client: client_params(session_id),
        payload: message_payload(content),
        metadata: metadata_params
      }
    )
  end

  def client_params(session_id)
    {
      bot_id: "chatwoot-bot-#{conversation.inbox.id}",
      channel_id: "chatwoot-bot-inbox-#{conversation.inbox.id}",
      user_id: session_id
    }
  end

  def message_payload(content)
    {
      content_type: 'text',
      content: { text: content }
    }
  end

  def metadata_params
    {
      conversation: conversation,
      contact: conversation.contact
    }
  end

  def bot_payload
    {
      id: "chatwoot-csml-bot-#{agent_bot.id}",
      name: "chatwoot-csml-bot-#{agent_bot.id}",
      default_flow: 'chatwoot_bot_flow',
      custom_components: {
        "WhatsappProducts": {
          "params": [
            {
              "catalog_id": {
                "required": true,
                "type": "String",
              }
            },
            {
              "header": {
                "required": true,
                "type": "String",
              }
            },
            {
              "products": {
                "required": true,
                "type": "Array",
              }
            },
            {
              "content": {
                "required": true,
                "type": "String",
              }
            },
            {
              "footer": {
                "required": false,
                "type": "String",
              }
            },
          ]
        },
        "TransferTeam": {
          "params": [
            {
              "id": {
                "required": true,
                "type": "String",
              }
            }
          ]
        },
        "TransferAgent": {
          "params": [
            {
              "id": {
                "required": true,
                "type": "String",
              }
            }
          ]
        },
        "AddLabels": {
          "params": [
            {
              "value": {
                "required": true,
                "type": "Array",
              }
            }
          ]
        },
        "RemoveLabels": {
          "params": [
            {
              "value": {
                "required": true,
                "type": "Array",
              }
            }
          ]
        },
      },
      flows: [
        {
          id: "chatwoot-csml-bot-flow-#{agent_bot.id}-inbox-#{conversation.inbox.id}",
          name: 'chatwoot_bot_flow',
          content: agent_bot.bot_config['csml_content'],
          commands: []
        }
      ]
    }
  end

  def process_response(message, response)
    csml_messages = response['messages']
    has_conversation_ended = response['conversation_end']

    process_action(message, 'handoff') if has_conversation_ended.present?

    return if csml_messages.blank?

    if ActiveModel::Type::Boolean.new.cast(ENV.fetch('FEATURE_IMPROVES_CSML', nil)) == true
      # Support csml wait
      messages_groups = split_messages_by_wait(csml_messages)
      process_messages_groups(messages_groups)
    else
      # We do not support wait, typing now.
      csml_messages.each do |csml_message|
        create_messages(csml_message, conversation)
      end
    end
  end

  def split_messages_by_wait(csml_messages)
    csml_messages.slice_after do |e|
      e['payload']['content_type'] == 'wait'
    end.map(&:to_a)
  end

  def process_messages_groups(messages_groups)
    wait = 0
    messages_groups.each do |g|
      g.each do |message|
        wait += message['payload']['content']['duration'] if message['payload']['content_type'] == 'wait'

        if wait < 1000
          AgentBots::CsmlProcessMessagesJob.perform_now(message, conversation, agent_bot)
        else
          seconds = wait / 1000
          AgentBots::CsmlProcessMessagesJob.set(wait: seconds).perform_later(message, conversation, agent_bot)
        end
      end
    end
  end

  def create_messages(message, conversation)
    message_payload = message['payload']

    case message_payload['content_type']
    when 'text'
      process_text_messages(message_payload, conversation)
    when 'question'
      process_question_messages(message_payload, conversation)
    when 'image'
      process_image_messages(message_payload, conversation)
    end
  end

  def process_text_messages(message_payload, conversation)
    conversation.messages.create!(
      {
        message_type: :outgoing,
        account_id: conversation.account_id,
        inbox_id: conversation.inbox_id,
        content: message_payload['content']['text'],
        sender: agent_bot
      }
    )
  end

  def process_question_messages(message_payload, conversation)
    buttons = message_payload['content']['buttons'].map do |button|
      { title: button['content']['title'], value: button['content']['payload'] }
    end
    conversation.messages.create!(
      {
        message_type: :outgoing,
        account_id: conversation.account_id,
        inbox_id: conversation.inbox_id,
        content: message_payload['content']['title'],
        content_type: 'input_select',
        content_attributes: { items: buttons }.merge(aditional_attributes(message_payload)),
        sender: agent_bot
      }
    )
  end

  def aditional_attributes(message_payload)
    result = { message_payload: message_payload }
    aditional_attributes = %w[image video document]
    aditional_attributes.each do |attribute|
      attribute_value = message_payload.dig('content', attribute)
      result.merge!({ "#{attribute}": attribute_value }) if attribute_value.present?
    end

    result
  end

  def prepare_attachment(message_payload, message, account_id)
    attachment_params = { file_type: :image, account_id: account_id }
    attachment_url = message_payload['content']['url']
    attachment = message.attachments.new(attachment_params)
    attachment_file = Down.download(attachment_url)
    attachment.file.attach(
      io: attachment_file,
      filename: attachment_file.original_filename,
      content_type: attachment_file.content_type
    )
  end

  def process_image_messages(message_payload, conversation)
    message = conversation.messages.new(
      {
        message_type: :outgoing,
        account_id: conversation.account_id,
        inbox_id: conversation.inbox_id,
        content: '',
        content_type: 'text',
        sender: agent_bot
      }
    )

    prepare_attachment(message_payload, message, conversation.account_id)
    message.save!
  end
end
