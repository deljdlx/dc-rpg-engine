# The seal

## Install
Connect to docker container and run the following command:

```sh
docker exec -it {{the-seal}} sh

# inside the container

cd /src
npm install
# because its a very old project, we need to use the legacy provider
export NODE_OPTIONS=--openssl-legacy-provider
npm run build
```

## Some examples

http://the-seal.jlb.ninja/static/?&containerColor0=%232D3C57CD&containerColor1=%23000000FF&text=The%20Seal&image=https%3A%2F%2Fec.europa.eu%2Fjrc%2Fsites%2Fdefault%2Ffiles%2Fstyles%2Fnormal-responsive%2Fpublic%2Ffotolia-92027264european-day-forest-green-forest.jpg%3Fitok%3Dp4u8v1R5&radius=149&crownRadius=231&titleRadius=156&gearSize=81&crownSkewX=53&crownSkewY=0&crownScaleX=77&crownScaleY=8&gearRadius=25&gearBorder=5&borderColor=%2366E3FFFF&borderSize=48&crownColor=%23FFAAAA94&textColor=%23F53C3CFF&rotationSpeed=3

http://the-seal.jlb.ninja/static/?&containerColor0=%232D3C57CD&containerColor1=%23000000FF&text=The%20Seal&image=https%3A%2F%2Fec.europa.eu%2Fjrc%2Fsites%2Fdefault%2Ffiles%2Fstyles%2Fnormal-responsive%2Fpublic%2Ffotolia-92027264european-day-forest-green-forest.jpg%3Fitok%3Dp4u8v1R5&radius=149&crownRadius=163&titleRadius=272&gearSize=10&crownSkewX=53&crownSkewY=0&crownScaleX=77&crownScaleY=8&gearRadius=25&gearBorder=5&borderColor=%239F66FFFF&borderSize=14&crownColor=%23FFAAAA94&textColor=%23FFFFFFFF&rotationSpeed=3

http://the-seal.jlb.ninja/static/?&containerColor0=%23C46BCFFF&containerColor1=%2346C1FFFF&text=The%20Seal&image=https%3A%2F%2Fmedia3.giphy.com%2Fmedia%2F3oKIPjzfv0sI2p7fDW%2F200.gif&radius=127&crownRadius=173&titleRadius=282&gearSize=205&crownSkewX=89&crownSkewY=9&crownScaleX=0&crownScaleY=161&gearRadius=0&gearBorder=17&borderColor=%23693655B7&borderSize=21&crownColor=%23D37AD07B&textColor=%23C56EC5FF&rotationSpeed=14

http://the-seal.jlb.ninja/static/?&containerColor0=%2312FFC2FF&containerColor1=%23000000FF&text=The%20Seal&image=https%3A%2F%2Fec.europa.eu%2Fjrc%2Fsites%2Fdefault%2Ffiles%2Fstyles%2Fnormal-responsive%2Fpublic%2Ffotolia-92027264european-day-forest-green-forest.jpg%3Fitok%3Dp4u8v1R5&radius=129&crownRadius=150&titleRadius=239&gearSize=33&crownSkewX=91&crownSkewY=0&crownScaleX=190&crownScaleY=183&gearRadius=100&gearBorder=5&borderColor=%23FFFFFFFF&borderSize=8&crownColor=%23FFAAAAFF&textColor=%23FF00FFFF&rotationSpeed=20# dc-the-seal
# rpg-engine
