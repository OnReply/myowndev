module Whatsapp::Providers::WhatsappCloudInteractiveMessages::List
  include Whatsapp::Providers::WhatsappCloudInteractiveMessages::Base

  def build_list_interactive_content(message)
    data = {
      "type": "list",
      "body": {
        "text": "#{message.content.truncate(1024, :omission => "")}"
      },
      "action": {
        "button": build_action_button(message),
        "sections": build_sections(message)
      }
    }

    data = build_list_header(message, data)
    data = build_footer(message, data)

    return data
  end

  private

  def build_sections(message)
    sections = get_sections(message)

    return build_list_options(sections, message)
  end

  def get_sections(message)
    sections = message.content_attributes.dig('message_payload', 'content', 'buttons').map do |item|
      item['content']['section_title']
    end.uniq
  end

  def build_action_button(message)
    if message.content_attributes.dig('message_payload', 'content', 'action_button').present?
      return message.content_attributes.dig('message_payload', 'content', 'action_button').truncate(20, :omission => "")
    else
      return 'Select'
    end
  end

  def build_list_options(sections, message)
    sections.map do | section |
      if section == nil
        section_title = "Options"
      else
        section_title = "#{section.truncate(24, :omission => "")}"
      end

      buttons = message.content_attributes['message_payload']['content']['buttons'].select { | button| button['content']['section_title'] == section}
      sections_rows = build_list_options_row(buttons)
      {"title": section_title, "rows": sections_rows }
    end.take(10)
  end

  def build_list_options_row(buttons)
    buttons.map.with_index do |item, index|
      result = {
        "id": "#{item["content"]["title"]}",
        "title": "#{item["content"]["title"].truncate(24, :omission => "")}"
      }

      description = item.dig('content', 'description')
      if description.present?
        result = result.merge({'description': "#{description.truncate(72, :omission => "")}" })
      end

      result
    end

  end

  def build_list_header(message, data)
    header = message.content_attributes.dig('message_payload', 'content', 'header')

    if header.present?
      return build_text_header(header, data)
    else
      return data
    end
  end
end