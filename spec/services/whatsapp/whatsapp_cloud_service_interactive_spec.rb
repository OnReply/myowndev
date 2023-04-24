require 'rails_helper'

describe Whatsapp::Providers::WhatsappCloudService do
  subject(:service) { described_class.new(whatsapp_channel: whatsapp_channel) }

  let(:whatsapp_channel) { create(:channel_whatsapp, provider: 'whatsapp_cloud', validate_provider_config: false, sync_templates: false) }
  let(:response_headers) { { 'Content-Type' => 'application/json' } }
  let(:whatsapp_response) { { messages: [{ id: 'message_id' }] } }

  describe '#send_message' do
    context 'when called' do
      it 'calls message endpoints for interactive quick buttons messages' do
        message = create(
          :message, message_type: :outgoing, content: 'test', content_type: 'input_select',
                    content_attributes: { 'items' => [{ 'title' => 'test', 'value' => 'test' }] },
                    inbox: whatsapp_channel.inbox
        )

        stub_request(:post, 'https://graph.facebook.com/v13.0/123456789/messages')
          .with(
            body: {
              messaging_product: 'whatsapp',
              to: '+123456789',
              interactive: {
                type: "button",
                body: {text: "test"},
                action: {
                  buttons:[ {type: "reply", reply: {id: "test",title: "test"}} ]}
                },
              type: "interactive"
            }.to_json
          )
          .to_return(status: 200, body: whatsapp_response.to_json, headers: response_headers)
        expect(service.send_message('+123456789', message)).to eq 'message_id'
      end

      it 'calls message endpoints for interactive list buttons messages' do
        message = create(
          :message, message_type: :outgoing, content: 'test', content_type: 'input_select',
                    content_attributes: { 'items' => [{ 'title' => 'test', 'value' => 'test' }, { 'title' => 'test 2', 'value' => 'test 2' }, { 'title' => 'test 3', 'value' => 'test 3'}, { 'title' => 'test 4', 'value' => 'test 4' } ] },
                    inbox: whatsapp_channel.inbox
        )

        stub_request(:post, 'https://graph.facebook.com/v13.0/123456789/messages')
          .with(
            body: {
              messaging_product: 'whatsapp',
              to: '+123456789',
              interactive: {
                type: "list", body: {:text=>"test"},
                action: { button: "Select", sections: [{title: "Options", rows: [{id: "test", title: "test"}, {id: "test 2", title: "test 2"}, {id: "test 3", title: "test 3"}, {id: "test 4", title: "test 4"}]}]}
              },
              type: "interactive"
            }.to_json
          )
          .to_return(status: 200, body: whatsapp_response.to_json, headers: response_headers)
        expect(service.send_message('+123456789', message)).to eq 'message_id'
      end
    end
  end
end
