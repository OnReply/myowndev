require 'rails_helper'

describe Integrations::Csml::ProcessorService do
  include ActiveJob::TestHelper

  let(:account) { create(:account) }
  let(:inbox) { create(:inbox, account: account) }
  let(:team) {create(:team, account: account)}
  let(:agent_bot) { create(:agent_bot, :skip_validate, bot_type: 'csml', account: account) }
  let(:agent_bot_inbox) { create(:agent_bot_inbox, agent_bot: agent_bot, inbox: inbox, account: account) }
  let(:conversation) { create(:conversation, account: account, status: :pending) }
  let(:message) { create(:message, account: account, conversation: conversation) }
  let(:event_name) { 'message.created' }
  let(:event_data) { { message: message } }

  describe '#perform' do
    let(:csml_client) { double }
    let(:processor) { described_class.new(event_name: event_name, agent_bot: agent_bot, event_data: event_data) }

    before do
      allow(CsmlEngine).to receive(:new).and_return(csml_client)
    end

    context 'should process assign team' do
      it 'valid team id' do
        csml_response = ActiveSupport::HashWithIndifferentAccess.new(
          messages: [{
            payload: {
              content_type: 'Component.transferteam',
              content: { id: team.id }
            }
          }]
        )
        allow(csml_client).to receive(:run).and_return(csml_response)
        perform_enqueued_jobs(only: Conversations::ActivityMessageJob) do
          processor.perform
        end
        expect(conversation.messages.last.content).to eql("Assign team id #{team.id}")
        expect(conversation.reload.team_id).to eql(team.id)
      end

      it 'invalid team id' do
        invalid_team_id = team.id+999
        csml_response = ActiveSupport::HashWithIndifferentAccess.new(
          messages: [{
            payload: {
              content_type: 'Component.transferteam',
              content: { id: invalid_team_id}
            }
          }]
        )
        allow(csml_client).to receive(:run).and_return(csml_response)
        perform_enqueued_jobs(only: Conversations::ActivityMessageJob) do
          processor.perform
        end
        expect(conversation.messages.last.content).to eql("Assign team id #{invalid_team_id} failed")
        expect(conversation.reload.team_id).to eql(nil)
      end
    end
  end
end
