module Whatsapp::Providers::WhatsappCloudInteractiveMessages::Base
  def build_image_header(image, data)
    if image.present?
      return data.merge({
        'header': {
          'type': 'image',
          'image':{ 'link': image }
        }
      })  
    else
      return data
    end
  end

  def build_text_header(header, data)
    if header.present?
      return data.merge({
          'header': {
            'type': 'text',
            'text': header.truncate(60, :omission => "")
          }
        })
    else
      return data
    end
  end

  def build_footer(message, data)
    if message.content_attributes.dig('message_payload', 'content', 'footer').present?
      data = data.merge({'footer': {'text':  message.content_attributes.dig('message_payload', 'content', 'footer').truncate(60, :omission => "") }})
    else
       return data
    end
  end
end
