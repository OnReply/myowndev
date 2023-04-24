module Whatsapp::Providers::WhatsappCloudInteractiveMessages
  def send_message(phone_number, message)
    if message.attachments.present?
      send_attachment_message(phone_number, message)
    elsif message.content_type == 'input_select'
      send_text_message_interactive(phone_number, message)
    else
      send_text_message(phone_number, message)
    end
  end

  def send_text_message_interactive(phone_number, message)
    response = HTTParty.post(
      "#{phone_id_path}/messages",
      headers: api_headers,
      body: {
        messaging_product: 'whatsapp',
        to: phone_number,
        interactive: build_interactive_content(message),
        type: 'interactive'
      }.to_json
    )

    process_response(response)
  end

  def build_interactive_content(message)
    if message.content_attributes["items"].length <= 3
      return build_interactive_quick_reply_content(message)
    else
      return build_interactive_list_content(message)
    end
  end

  # Docs: https://developers.facebook.com/docs/messenger-platform/reference/buttons/quick-replies/#quick_reply
  def build_interactive_quick_reply_content(message)
    buttons = message.content_attributes["items"].map do |item|
      {
        "type": "reply",
        "reply": {
          "id": "#{item["value"]}",
          "title": "#{item["title"].truncate(20, :omission => "")}"
        }
      }
    end

    return {
      "type": "button",
      "body": {
        "text": "#{message.content}"
      },
      "action": {
        "buttons": buttons
      }
    }
  end

  def build_interactive_list_content(message)
    buttons = message.content_attributes["items"].map do |item|
      {
        "id": "#{item["value"]}",
        "title": "#{item["title"].truncate(24, :omission => "")}"
      }
    end

    return {
      "type": "list",
      "body": {
        "text": "#{message.content}"
      },
      "action": {
        "button": "Select",
        "sections": [
          {
            "title": "Options",
            "rows": buttons
          }
        ]
      }
    }
  end
end
