class PetsController < ApplicationController
  before_action :authenticate_user!, except: :index
  before_action :set_user, except: :index
  before_action :set_pet, only: %i[edit update show find_pet find_master adopt_pet]
  before_action :check_if_authorized, only: %i[update create find_pet find_master adopt_pet]

  def index
    @q = Pet.ransack(params[:q])
    @pets = @q.result.order(:name).page params[:page]
  end

  def show; end

  def create
    @pet = @user.pets.build(pet_params)

    redirect_to user_path(current_user), notice: 'The pet has been added.' if @pet.save
  end

  def edit; end

  def update
    redirect_to user_path(current_user), notice: 'The pet has been updated.' if @pet.update(pet_params)
  end

  def destroy
    @pet = current_user.pets.find(params[:id])
    @pet.destroy

    respond_to do |format|
      format.js { render layout: false }
    end
  end

  def find_pet
    @posts = @pet.posts.with_lost_pet
    @posts.destroy_all
    @pet.home_again!
    redirect_to @user, notice: "The pet has been found! You can share the success story by click on the 'Share Success Story' button."
  end

  def find_master
    @posts = @pet.posts.with_found_pet
    @posts.destroy_all
    @pet.home_again!
    redirect_to @user, notice: "The pet master has been found! You can share the success story by click on the 'Share Success Story' button."
  end

  def adopt_pet
    @posts = @pet.posts.with_pet_to_adopt
    @posts.destroy_all
    @pet.adopted!
    redirect_to @user, notice: "The pet has found its family! You can share the success story by click on the 'Share Success Story' button."
  end

  private

  def pet_params
    params.require(:pet).permit(:user_id, :name, :species, :breed, :sex, :sterilized, :date_of_birth, :color, :additional_info, :avatar, :status, :social_network_link)
  end

  def set_user
    @user = User.find(params[:user_id])
  end

  def set_pet
    @pet = Pet.find(params[:id])
  end

  def check_if_authorized
    if current_user == @user
    end
  end
end
