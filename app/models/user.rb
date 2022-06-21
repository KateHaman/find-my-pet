# == Schema Information
#
# Table name: users
#
#  id                     :bigint           not null, primary key
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  reset_password_token   :string
#  reset_password_sent_at :datetime
#  remember_created_at    :datetime
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  admin                  :boolean          default(FALSE)
#  name                   :string
#  slug                   :string
#  allow_email            :boolean
#  phone                  :string
#  telegram               :string
#  viber                  :string
#  facebook               :string
#  instagram              :string
#
class User < ApplicationRecord
  include Friendable

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :confirmable

  with_options dependent: :destroy do |assoc|
    assoc.has_many :pets
    assoc.has_many :posts
  end

  has_one_attached :avatar

  validates :avatar, file_size: { less_than_or_equal_to: 10.megabytes, message: 'should be less than %{count}' },
                     file_content_type: { allow: %w[image/jpeg image/png image/gif], message: 'only allows jpeg, png and gif' }
  validates :name, :email, presence: true
  validates :password, presence: true, allow_nil: true
  validates :name, length: { in: 2..30 }
  validates_format_of  :email, with: /(^[\+A-Z0-9\._%-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$)/i

  validate :password_complexity

  def password_complexity
    return if password.blank? || password =~ /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])/

    errors.add :password, 'must include at least one lowercase letter, one uppercase letter, and one digit.'
  end

  def slug_candidates
    [:name] + Array.new(6) { |index| [:name, index + 2] }
  end

  def should_generate_new_friendly_id?
    name_changed?
  end
end
