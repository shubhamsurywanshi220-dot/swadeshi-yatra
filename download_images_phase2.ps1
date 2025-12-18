$images = @{
    # GOA
    "goa_calangute.jpg" = "https://images.unsplash.com/photo-1590499696773-4556488a08d2?q=80&w=1000"
    "goa_basilica.jpg" = "https://images.unsplash.com/photo-1598522338274-0f1c305d2639?q=80&w=1000"
    "goa_dudhsagar.jpg" = "https://images.unsplash.com/photo-1544377035-7c2765365db4?q=80&w=1000"
    "goa_fort_aguada.jpg" = "https://images.unsplash.com/photo-1524230659092-07f99a75c013?q=80&w=1000"
    "goa_palolem.jpg" = "https://images.unsplash.com/photo-1588965879788-294326f2bb6f?q=80&w=1000"
    
    # UTTARAKHAND
    "uk_rishikesh.jpg" = "https://images.unsplash.com/photo-1592305886650-7058a98d363d?q=80&w=1000"
    "uk_nainital.jpg" = "https://images.unsplash.com/photo-1591544439063-8a39e802773c?q=80&w=1000"
    "uk_kedarnath.jpg" = "https://images.unsplash.com/photo-1628108502302-869273c52431?q=80&w=1000"
    "uk_jim_corbett.jpg" = "https://images.unsplash.com/photo-1596541539207-69c5c163625f?q=80&w=1000"
    "uk_valley_of_flowers.jpg" = "https://images.unsplash.com/photo-1627915993700-60a618d2de45?q=80&w=1000"

    # GUJARAT
    "gj_statue_of_unity.jpg" = "https://images.unsplash.com/photo-1591100342981-b5443fa49221?q=80&w=1000"
    "gj_rann_of_kutch.jpg" = "https://images.unsplash.com/photo-1610996885694-8898194488b0?q=80&w=1000"
    "gj_gir_lion.jpg" = "https://images.unsplash.com/photo-1563721051-5121b6567e7c?q=80&w=1000"
    "gj_somnath.jpg" = "https://images.unsplash.com/photo-1632752536836-82z5B1g3_y7W?q=80&w=1000" 
    "gj_sun_temple.jpg" = "https://images.unsplash.com/photo-1628082008779-7a550d5ec42c?q=80&w=1000"
}

$dest = "backend/public/images"
if (!(Test-Path $dest)) { New-Item -ItemType Directory -Path $dest | Out-Null }

foreach ($key in $images.Keys) {
    if (!(Test-Path "$dest/$key")) {
        echo "Downloading $key ..."
        Invoke-WebRequest -Uri $images[$key] -OutFile "$dest/$key"
    } else {
        echo "Skipping $key (Exists)"
    }
}
