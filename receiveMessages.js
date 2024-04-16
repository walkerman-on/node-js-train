const amqp = require("amqplib")
const dotenv = require("dotenv")
dotenv.config()

async function receiveMessages() {
	try {
		// Подключение к RabbitMQ
		const connection = await amqp.connect(
			`amqp://${process.env.LOGIN_RABBITMQ}:${process.env.PASSWORD_RABBITMQ}@${process.env.IP_VIRTUAL_MACHINE}`
		)
		// Создание канала
		const channel = await connection.createChannel()
		// Объявление очереди, из которой будем получать сообщения
		const queue = "CORWIN"
		await channel.assertQueue(queue, { durable: false })

		console.log(
			" [*] Ожидание сообщений в очереди %s. Для выхода нажмите CTRL+C",
			queue
		)

		// Начало прослушивания очереди
		channel.consume(
			queue,
			function (msg) {
				console.log(" [x] Получено сообщение: %s", msg.content.toString())
			},
			{ noAck: true }
		)
	} catch (error) {
		console.error(error)
	}
}

receiveMessages()
