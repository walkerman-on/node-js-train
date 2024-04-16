const amqp = require("amqplib")

async function sendToQueue() {
	const connection = await amqp.connect(
		`amqp://${process.env.LOGIN_RABBITMQ}:${process.env.PASSWORD_RABBITMQ}@${process.env.IP_VIRTUAL_MACHINE}`
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
