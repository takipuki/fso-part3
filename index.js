const morgan = require('morgan');
const express = require('express');
const cors = require('cors');
const mdl_person = require('./models/Person.js');
require('dotenv').config();

const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));
app.use(morgan(
	(tokens, req, res) => {
		return [
			tokens.method(req, res),
			tokens.url(req, res),
			tokens.status(req, res),
			tokens.res(req, res, 'content-length'), '-',
			tokens['response-time'](req, res), 'ms',
			JSON.stringify(req.body),
		].join(' ')
	}
	// { skip: (req, _) => req.method != 'POST' }
));


app.get('/info', (_, res, next) => {
	mdl_person
		.find({})
		.then(result => res.send(`
			<p>Phonebook has info for ${result.length} people</p>
			<p>${(new Date()).toString()}</p>
		`))
		.catch(err => next(err));
});


app.get('/api/persons', (_, res, next) => {
	mdl_person
		.find({})
		.then(result => res.json(result))
		.catch(err => next(err));
});


app.get('/api/persons/:id', (req, res, next) => {
	mdl_person
		.findById(req.params.id)
		.then(result => {
			if (!result) return res.status(404).end();
			res.json(result);
		})
		.catch(err => next(err));
});


app.post('/api/persons', (req, res, next) => {
	if (!(req.body.name && req.body.number))
		return res.status(400).json({ error: 'empty name or number' });

	mdl_person
		.findOne({name: req.body.name})
		.then(result => {
			if (result)
				return res.status(400).json({ error: 'name already exists' });

			const p = new mdl_person({
				name: req.body.name,
				number: req.body.number,
			});

			p.save()
				.then(result => res.status(201).json(result))
				.catch(err => next(err));
		})
		.catch(err => next(err));
});


app.put('/api/persons/:id', (req, res, next) => {
	if (!(req.body.name && req.body.number))
		return res.status(400).json({ error: 'empty name or number' });

	mdl_person
		.findByIdAndUpdate(req.params.id, { number: req.body.number })
		.then(result => {
			result.number = req.body.number;
			res.json(result);
		})
		.catch(err => next(err));
})


app.delete('/api/persons/:id', (req, res, next) => {
	mdl_person
		.deleteOne({ _id: req.params.id })
		.then(_ => res.status(204).end())
		.catch(err => next(err));
});


app.use((err, req, res, next) => {
	console.log(err.message);
	switch (err.name) {
	case 'CastError':
		res.status(400).json({ error: "invalid id" });
		break;
	default:
		res.status(500).end();
	}
})


app.listen(PORT, () => console.log(`server on port ${PORT}`));
