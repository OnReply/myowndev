class ChangeLockToSingleConversationDefault < ActiveRecord::Migration[7.0]
  def change
    change_column_default :inboxes, :lock_to_single_conversation, true
  end
end
