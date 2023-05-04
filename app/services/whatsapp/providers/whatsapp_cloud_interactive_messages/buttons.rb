module Whatsapp::Providers::WhatsappCloudInteractiveMessages::Buttons
  include Whatsapp::Providers::WhatsappCloudInteractiveMessages::Base

  def build_buttons_interactive_content(message)
    data = {
      'type': 'button',
      'body': {
        'text': "#{message.content}"
      },
      'action': {
        'buttons': build_buttons(message)
      }
    }

    data = build_buttons_header(message, data)
    build_footer(message, data)
  end

  private

  def build_buttons(message)
    message.content_attributes['message_payload']['content']['buttons'].map do |item|
      {
        'type': 'reply',
        'reply': {
          'id': "#{item['content']['title']}",
          'title': "#{item['content']['title'].truncate(20, :omission => '')}"
        }
      }
    end
  end

  def build_buttons_header(message, data)
    image = message.content_attributes.dig('message_payload', 'content', 'image')
    header = message.content_attributes.dig('message_payload', 'content', 'header')

    if image.present?
      build_image_header(image, data)
    elsif header.present?
      build_text_header(header, data)
    else
      data
    end
  end
end
