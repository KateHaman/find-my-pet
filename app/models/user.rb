class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :pets, dependent: :destroy
  has_many :posts, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :sender_conversations, class_name: 'Conversation', foreign_key: 'sender_id', dependent: :destroy
  has_many :recipient_conversations, class_name: 'Conversation', foreign_key: 'recipient_id', dependent: :destroy
  has_many :messages, dependent: :destroy
  has_many :likes, dependent: :destroy

  validates :name, :email, :password, presence: true
  validate :password_complexity

  def password_complexity
    return if password.blank? || password =~ /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])/

    errors.add :password, 'must include at least one lowercase letter, one uppercase letter, and one digit.'
  end
end
