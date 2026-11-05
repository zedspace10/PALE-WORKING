# Artwork

The Explore pictures (apart from the Moon, which is a NASA photograph) and the four Home card pictures are rendered here.

Deep sky scenes are drawn with numpy and scipy:

```
python3 deepfield.py 1080 1350 5 edge observable-edge.jpg
python3 deepfield.py 1440 810 9 card time-machine.jpg
python3 orion.py
python3 galcentre.py
python3 andromeda.py
python3 proxima.py
python3 landscape.py tonight
python3 landscape.py observatory
```

Mars, Saturn, Earth and Voyager 1 are three.js scenes rendered in headless Chromium. Copy `three.module.js` and `three.core.js` from `node_modules/three/build` and the planet maps (`mars.webp`, `saturn.webp`, `earth.webp`, `earth-clouds.webp`) from the Stellara site's `public/textures` into this folder, then:

```
node shoot.cjs '[["planets.html","mars",2160,2700,"mars.png"],["planets.html","saturn",2160,2700,"saturn.png"],["planets.html","earth",2880,1620,"earth-card.png"],["voyager.html","v",2160,2700,"voyager.png"]]'
```

The PNGs are rendered at twice the final size and scaled down to 1080 by 1350 (Explore) or 1440 by 810 (Home cards). The planet maps are by Solar System Scope, CC BY 4.0, credited on the You tab.
