"""
The flask application package.
"""
from os.path import join, exists, dirname
from logging import FileHandler, WARNING
from getpass import getuser
from tempfile import gettempdir
from os import getcwd
from flask import Flask

app = Flask(__name__)
import Demo.views
here = dirname(__file__)
static_folder = None
for folder in [join(getcwd(), 'static'), join(getcwd(), '../static'), here + '/static', here +'/../static']:
    if exists(folder):
        static_folder = folder
        break
if static_folder is None:
    raise Exception("Could not find client state files (static/)")

template_folder = None
for folder in [join(getcwd(), 'templates'), join(getcwd(), '../templates'), here + '/templates', here +'/../templates']:
    if exists(folder):
        template_folder = folder
        break

def init():

	from Demo.api import api_blueprint
	app.register_blueprint(api_blueprint, url_prefix='/api/')

init()
