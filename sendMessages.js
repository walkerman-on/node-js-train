const amqp = require("amqplib")

const LOGIN_RABBITMQ = "student"
const PASSWORD_RABBITMQ = "student"
const IP_VIRTUAL_MACHINE = "10.211.55.3"

async function sendToQueue() {
	const connection = await amqp.connect(
		`amqp://${LOGIN_RABBITMQ}:${PASSWORD_RABBITMQ}@${IP_VIRTUAL_MACHINE}`
	) // Устанавливаем соединение с RabbitMQ с указанием пользователя и пароля
	const channel = await connection.createChannel() // Создаем канал

	const queueName = "hello" // Имя очереди

	// Создаем очередь (если ее нет)
	await channel.assertQueue(queueName, {
		durable: false, // Указываем, что очередь не будет сохранена на диске
	})

	const message = "Hello World!" // Сообщение для отправки

	// Отправляем сообщение в очередь
	channel.sendToQueue(queueName, Buffer.from(message))

	console.log(`[x] Sent '${message}'`)

	// Закрываем канал и соединение
	await channel.close()
	await connection.close()
}

sendToQueue().catch(console.error)
