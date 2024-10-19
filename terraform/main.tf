resource "docker_image" "todo_image" {
	name = "trainwithshubham/todo-app-node:latest"
	keep_locally = false
}

resource "docker_container" "todo_container" {
	image = docker_image.todo_image.name
	name = "todoapp-container"
	ports {
		internal = 8081
		external = 8081
	}

	depends_on = [
		docker_image.todo_image
	]
	
}
