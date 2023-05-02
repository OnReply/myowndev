module Whatsapp::Providers::WhatsappCloudInteractiveMessages::Buttons
  include Whatsapp::Providers::WhatsappCloudInteractiveMessages::Base

  def build_buttons_interactive_content(message)
    data = {
      "type": "button",
      "body": {
        "text": "#{message.content}"
      },
      "action": {
        "buttons": build_buttons(message)
      }
    }

    data = build_header(message, data)
    data = build_footer(message, data)

    return data
  end

  private

  def build_buttons(message)
    message.content_attributes['message_payload']['content']['buttons'].map do |item|
      {
        "type": "reply",
        "reply": {
          "id": "#{item["content"]["title"]}",
          "title": "#{item["content"]["title"].truncate(20, :omission => "")}"
        }
      }
    end
  end
end