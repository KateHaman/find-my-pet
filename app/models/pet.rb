# == Schema Information
#
# Table name: pets
#
#  id              :bigint           not null, primary key
#  name            :string
#  species         :integer
#  breed           :string
#  sex             :integer
#  sterilized      :boolean
#  date_of_birth   :date
#  color           :string
#  additional_info :text
#  user_id         :bigint           not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  slug            :string
#  status          :integer          default("home"), not null
#
class Pet < ApplicationRecord
  include Friendable

  belongs_to :user
  has_many :posts, dependent: :destroy

  has_one_attached :avatar

  validates :avatar, file_size: { less_than_or_equal_to: 10.megabytes, message: 'is too big. It should be less than %{count}' },
                     file_content_type: { allow: %w[image/jpeg image/png image/gif], message: 'only allows jpeg, png and gif' }
  validates :species, :sex, :color, :status, presence: true

  enum species: { cat: 1, dog: 2 }
  enum sex: { male: 1, female: 2, undefined: 3 }
  enum status: { home: 0, lost: 1, found: 2, to_adopt: 3, home_again: 4, adopted: 5 }

  def slug_candidates
    [:name] + Array.new(6) { |index| [:name, index + 2] }
  end

  def should_generate_new_friendly_id?
    name_changed?
  end
end
