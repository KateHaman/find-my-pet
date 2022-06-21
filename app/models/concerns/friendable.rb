module Friendable
  extend ActiveSupport::Concern

  included do
    extend FriendlyId
    friendly_id :slug_candidates, use: %i[slugged finders]
  end
end