module GoogleMapsHelper

  def google_maps_api_script_tag
    javascript_include_tag google_maps_api_source,
                           async: true,
                           defer: true
  end

  def google_maps_api_source
    "https://maps.googleapis.com/maps/api/js?key=#{ google_maps_api_key }&region=UK&language=uk&callback=initMap"
  end

  def google_maps_api_key
    Rails.application.credentials.fetch(:google_api_key)
  end

  def google_maps_api_script_initialize
    javascript_include_tag "google_maps"
  end

end
