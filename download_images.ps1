$images = @{
    "hampi.jpg" = "https://images.unsplash.com/photo-1542397284385-6010376c5337?q=80&w=1000"
    "mysore_palace.jpg" = "https://images.unsplash.com/photo-1590766940589-5640e85cc420?q=80&w=1000"
    "coorg_abbey.jpg" = "https://images.unsplash.com/photo-1555132205-d183067db84d?q=80&w=1000"
    "lalbagh.jpg" = "https://images.unsplash.com/photo-1596716766436-11f8b37568bd?q=80&w=1000"
    "gokarna_om.jpg" = "https://images.unsplash.com/photo-1591543621404-35ca10c345b5?q=80&w=1000"
    "jog_falls.jpg" = "https://images.unsplash.com/photo-1624522900742-b0522197560a?q=80&w=1000"
    "bandipur.jpg" = "https://images.unsplash.com/photo-1599596355866-9e9989ddcc26?q=80&w=1000"
    "chikmagalur.jpg" = "https://images.unsplash.com/photo-1601227092892-0b1a29272337?q=80&w=1000"
    "murudeshwar.jpg" = "https://images.unsplash.com/photo-1632752536836-82z5B1g3_y7W?q=80&w=1000"
    "badami.jpg" = "https://images.unsplash.com/photo-1629810620923-b6c8b4b7f7e9?q=80&w=1000"
    "belur.jpg" = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Hoysaleswara_Temple_in_Halebidu.jpg/800px-Hoysaleswara_Temple_in_Halebidu.jpg"
    "nagarhole.jpg" = "https://images.unsplash.com/photo-1599320857731-27d14Cc357a7?q=80&w=1000"
}

$dest = "backend/public/images"
if (!(Test-Path $dest)) { New-Item -ItemType Directory -Path $dest | Out-Null }

foreach ($key in $images.Keys) {
    echo "Downloading $key ..."
    Invoke-WebRequest -Uri $images[$key] -OutFile "$dest/$key"
}
