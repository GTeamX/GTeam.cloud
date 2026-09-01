# sudo dnf install nodejs24-npm

podman run --rm -it \
  -v "$(pwd)":/app:z \
  -w /app \
  docker.io/library/node:20-alpine \
  sh -c "npm install tailwindcss @tailwindcss/cli && npx @tailwindcss/cli -i ./css/input.css -o ./css/styles.css --watch"