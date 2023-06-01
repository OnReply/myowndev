class AgentBots::CsmlProcessMessagesJob < ApplicationJob
  queue_as :high

  def perform(messages, conversation, agent_bot)
    Integrations::Csml::ProcessMessage.new(
      messages: messages,
      conversation: conversation,
      agent_bot: agent_bot
    ).perform
  end
end
