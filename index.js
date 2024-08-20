const morgan = require('morgan');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

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
	},
	{ skip: (req, _) => req.method != 'POST' }
));

const PORT = 3000;

let people = [
	{ 
		"id": "1",
		"name": "Arto Hellas", 
		"number": "040-123456"
	},
	{ 
		"id": "2",
		"name": "Ada Lovelace", 
		"number": "39-44-5323523"
	},
	{ 
		"id": "3",
		"name": "Dan Abramov", 
		"number": "12-43-234345"
	},
	{ 
		"id": "4",
		"name": "Mary Poppendieck", 
		"number": "39-23-6423122"
	}
];


app.get('/info', (_, res) => {
	res.send(`
<p>Phonebook has info for ${people.length} people</p>
<p>${(new Date()).toString()}</p>
`)
});


app.get('/api/persons', (_, res) => {
	res.json(people);
});


app.get('/api/persons/:id', (req, res) => {
	const p = people.find(v => v.id === req.params.id);
	if (!p) return res.status(404).end();
	res.json(p);
});


app.post('/api/persons', (req, res) => {
	if (!(req.body.name && req.body.number))
		return res.status(400).json({ error: 'empty name or number' });

	if (people.some(v => v.name === req.body.name))
		return res.status(400).json({ error: 'name already exists' });

	const p = {
		id: Math.round(Math.random() * 100).toString(),
		...req.body,
	};

	people = people.concat(p);
	
	res.status(201).json(p);
});


app.put('/api/persons/:id', (req, res) => {
	if (!(req.body.name && req.body.number))
		return res.status(400).json({ error: 'empty name or number' });

	let tmp = null;
	people = people.map(v => {
		if (v.id === req.params.id) {
			tmp = {id: v.id, ...req.body}
			return tmp;
		}
		return v;
	})

	if (!tmp) {
		tmp = {id: req.params.id, ...req.body};
		people = people.concat(tmp);
	}

	res.json(tmp);
})


app.delete('/api/persons/:id', (req, res) => {
	let tmp = null;
	people = people.filter(v => {
		if (v.id === req.params.id) {
			tmp = v;
			return false;
		}
		return true;
	});

	if (tmp) res.json(tmp);
	else res.status(204).end();
});


app.listen(PORT);
