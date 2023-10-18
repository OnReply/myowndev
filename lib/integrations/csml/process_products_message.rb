module Integrations::Csml::ProcessProductsMessage
  include Integrations::Csml::ProcessFileMessage

  def create_messages(message, conversation)
    message_payload = message['payload']

    case message_payload['content_type']
    when 'text'
      process_text_messages(message_payload, conversation)
    when 'question'
      process_question_messages(message_payload, conversation)
    when 'Component.whatsappproducts'
      process_products_messages(message_payload, conversation)
    when 'Component.transferteam'
      process_assign_team(message_payload, conversation)
    when 'Component.transferagent'
      process_assign_agent(message_payload, conversation)
    when 'image'
      process_image_messages(message_payload, conversation)
    when 'file'
      process_file_messages(message_payload, conversation)
    end
  end

  def process_assign_agent(message_payload, conversation)
    if AgentBots::ActionService.new(conversation.account, conversation).assign_agent([message_payload['content']['id'].to_i])
      content = "Assign agent id #{message_payload['content']['id']}"
    else
      content = "Assign agent id #{message_payload['content']['id']} failed"
    end

    Conversations::ActivityMessageJob.perform_later(conversation, activity_message_params(conversation,content))
  end

  def process_assign_team(message_payload, conversation)
    if AgentBots::ActionService.new(conversation.account, conversation).assign_team([message_payload['content']['id'].to_i])
      content = "Assign team id #{message_payload['content']['id']}"
    else
      content = "Assign team id #{message_payload['content']['id']} failed"
    end
    
    Conversations::ActivityMessageJob.perform_later(conversation, activity_message_params(conversation,content))
  end
  
  def activity_message_params(conversation, content)
    { account_id: conversation.account_id, inbox_id: conversation.inbox_id, message_type: :activity, content: content }
  end

  def process_products_messages(message_payload, conversation)
    conversation.messages.create!(
     {
       message_type: :outgoing,
       account_id: conversation.account_id,
       inbox_id: conversation.inbox_id,
       content: message_payload['content']['content'],
       content_type: 'integrations',
       content_attributes: { 
         type: 'whatsappproducts',
         products: message_payload['content']['products'],
         header: message_payload['content']['header'],
         catalog_id: message_payload['content']['catalog_id'],
         footer: message_payload['content']['footer'],
         message_payload: message_payload,
       },
       sender: agent_bot
     }
   )
  end
end