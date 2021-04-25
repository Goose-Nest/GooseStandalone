#!/bin/bash

name="goosealone" # Name of the client

gooseupdate_branch="goosemod" # GooseUpdate branch to use
gooseupdate_host="https://updates.goosemod.com" # GooseUpdate host to use (you probably want the official one, https://updates.goosemod.com)

channel="canary" # Discord channel to base on (stable, canary, ptb, development)


tar="discord-$channel.tar.gz"

original_base="Discord${channel^}"
new_base="${name^}${channel^}"

echo "GooseStandalone Builder v0.1.0"
echo

echo "Channel: $channel"
echo

echo "GooseUpdate Branch: $gooseupdate_branch"
echo "GooseUpdate Host: $gooseupdate_host"
echo

echo "Tar: $tar"
echo

echo "Original Base: $original_base"
echo "New Base: $new_base"
echo
echo

echo "Getting original base..."

if [ ! -f "$tar" ]; then
  echo "Original tar not found, downloading..."
  wget "https://discord.com/api/download/$channel?platform=linux&format=tar.gz" -O $tar

  echo
  echo "Finished original tar download"
  echo
fi

echo "Got tar"

if [ ! -d "$original_base" ]; then
  echo "Original base not found, extracting tar..."
  tar -xf "$tar"

  echo
  echo "Extracted original tar"
  echo
fi

echo "Got base dir"
echo
echo "Clearing new base..."
rm -rf "$new_base"

echo
echo "Beginning conversion..."
echo

echo "Base:"

echo "Copying base..."
cp -rf "$original_base" "$new_base"

cd "$new_base"

echo "Renaming exec..."
mv "$original_base" "$new_base"

echo
echo "Desktop file:"
echo "Renaming desktop file..."
mv "discord-$channel.desktop" "$name-$channel.desktop"

echo
echo "Replacing words in desktop file..."

echo "discord -> $name"
sed -i "s/discord/$name/g" "$name-$channel.desktop"

echo "Discord -> ${name^}"
sed -i "s/Discord/${name^}/g" "$name-$channel.desktop"

echo
echo "Asar modding:"

echo "Extracting app.asar"

mkdir "asar"
asar extract "resources/app.asar" "asar"

echo "Replacing constant variables"
echo

update_endpoint_url="$gooseupdate_host/$gooseupdate_branch"
new_update_endpoint_url="$update_endpoint_url/"

update_endpoint_code_original="const UPDATE_ENDPOINT = settings.get('UPDATE_ENDPOINT') || API_ENDPOINT"
update_endpoint_code_new="const UPDATE_ENDPOINT = settings.get('UPDATE_ENDPOINT') || '$update_endpoint_url'"

new_update_endpoint_code_original="const NEW_UPDATE_ENDPOINT = settings.get('NEW_UPDATE_ENDPOINT') || 'https://discord.com/api/updates/'"
new_update_endpoint_code_new="const NEW_UPDATE_ENDPOINT = settings.get('NEW_UPDATE_ENDPOINT') || '$new_update_endpoint_url'"

echo "Setting UPDATE_ENDPOINT default to $update_endpoint_url"
echo "$update_endpoint_code_original -> $update_endpoint_code_new"

echo "s/${update_endpoint_code_original//\//\\\/}/${update_endpoint_code_new//\//\\\/}/g"

sed -i "s/${update_endpoint_code_original//\//\\\/}/${update_endpoint_code_new//\//\\\/}/g" "asar/app_bootstrap/Constants.js"

echo

echo "Setting NEW_UPDATE_ENDPOINT default to $new_update_endpoint_url"
echo "$new_update_endpoint_code_original -> $new_update_endpoint_code_new"

echo "s/${update_endpoint_code_original//\//\\\/}/${update_endpoint_code_new//\//\\\/}/g"

sed -i "s/${new_update_endpoint_code_original//\//\\\/}/${new_update_endpoint_code_new//\//\\\/}/g" "asar/app_bootstrap/Constants.js"

echo

echo "Replacing user data path"

userdata_code_original="return _path.default.join(userDataRoot, 'discord' + (buildInfo.releaseChannel == 'stable' ? '' : buildInfo.releaseChannel))"
userdata_code_new="return _path.default.join(userDataRoot, '$name' + (buildInfo.releaseChannel == 'stable' ? '' : buildInfo.releaseChannel))"

echo "$userdata_code_original -> $userdata_code_new"

echo "s/$userdata_code_original/$userdata_code_new/g"

sed -i "s/$userdata_code_original/$userdata_code_new/g" "asar/common/paths.js"

echo

echo "Disabling host updates"

disable_host_original="return defaultValue"
disable_host_new="return key === 'SKIP_HOST_UPDATE' ? true : defaultValue"

echo "$disable_host_original -> $disable_host_new"

echo "s/$disable_host_original/$disable_host_new/g"

sed -i "s/$disable_host_original/$disable_host_new/g" "asar/common/Settings.js"

echo
echo "Repacking app.asar"

asar pack "asar" "resources/app.asar"

echo "Removing asar extract"
# rm -rf "asar"