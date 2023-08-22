@docker-clean() {
  docker rmi "$(docker images -qf dangling=true)" 2>/dev/null
  docker volume rm "$(docker volume ls -qf dangling=true)" 2>/dev/null
  docker system prune -f
}
