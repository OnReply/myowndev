module Whatsapp::Providers::WhatsappCloudInteractiveMessages::Base
  def build_header(message, data)
    if message.content_attributes.dig('message_payload', 'content', 'header').present?
      return data.merge({
          'header': {
            'type': 'text',
            'text': message.content_attributes.dig('message_payload', 'content', 'header').truncate(60, :omission => "")
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