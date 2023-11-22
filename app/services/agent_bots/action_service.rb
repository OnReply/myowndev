class AgentBots::ActionService < ActionService
  def initialize(account, conversation)
    super(conversation)
    @account = account
  end
end
