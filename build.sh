#!/bin/bash

pip install -r requirements.txt
python manage.py migrate
npm install
npm run build