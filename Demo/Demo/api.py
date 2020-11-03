from flask import Response, request, render_template, redirect, url_for, flash, json, Blueprint, session
#from flask.ext.login import login_user, login_required, logout_user
#from flask.ext.triangle import Triangle
import pprint
import time
from Demo import app
#import pypyodbc
import hashlib
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import base64
import pdb
import database as dbs
import pymysql.cursors
import os

api_blueprint = Blueprint('api', __name__)

CON_STR="Connection"
STATIC_FOLDER = app.static_folder
database = dbs.Database(CON_STR, STATIC_FOLDER)

@api_blueprint.route('getImageUrl', methods=['GET'])
def getImageUrl():
    #pdb.set_trace()
    category=request.args.get('category')
    data = dict()
    #data['elements'] = ['/static/images/Elements/Balloons/numberedballoons01.png','/static/images/Elements/Balloons/numberedballoons02.png','/static/images/Elements/Balloons/numberedballoons03.png']
    data['elements']=database.GetElementUrl()
    data['images']=database.GetImageUrl(category)['url']
    data['toLoad']=['']+database.GetImageUrl(category)['c_url']
    data['cost']= ['$4.99']+database.GetImageUrl(category)['cost']
    data['images']=['/static/images/templates/scratch.jpg']+data['images']
    return Response(json.dumps(data, sort_keys=True, indent=4, separators=(',', ': ')), mimetype='text/json'), 200

@api_blueprint.route('getCategoryNames', methods=['GET'])
def getCategoryNames():
    #data=['Thanksgiving','Birthday','Wedding','Bachelorette','Christmas','Newyear','BridalShower','Celebration','Business','Baby Shower','College','Kids','Generic']
    data=database.GetCategory()
    #pdb.set_trace()
    return Response(json.dumps(data, sort_keys=True, indent=4, separators=(',', ': ')), mimetype='text/json'), 200
  
@api_blueprint.route('saveImage', methods=['POST'])
def saveImage():
    orderid=database.getOrderId()
    result = request.data
    imgData = result[22:]
    filename = orderid+'.png'  # I assume you have a way of picking unique filenames
    with open(filename, 'wb') as f:
        f.write(imgData.decode('base64'))
    return "Success"

@api_blueprint.route('sendEmail', methods=['GET'])
def sendEmail():
    #pdb.set_trace()
    email=request.args.get('email')
    orderid=request.args.get('orderid')
    me ="pixelfreelancers@gmail.com"
    you =email

    # Create message container - the correct MIME type is multipart/alternative.
    msg = MIMEMultipart('alternative')
    msg['Subject'] = "Pixel"
    msg['From'] = me
    msg['To'] = you

    # Create the body of the message (a plain-text and an HTML version).
    text = "Thanks for placing order. Your orderid is"+orderid
    html = """
    <html>
      <head></head>
      <body>
        <p>Hi!<br>
           How are you?<br>
           Here is the <a href="http://www.python.org">link</a> you wanted.
        </p>
      </body>
    </html>
    """
    part1 = MIMEText(text, 'plain')
    part2 = MIMEText(html, 'html')
    msg.attach(part1)
    msg.attach(part2)
    # Send the message via local SMTP server.
    #mail = smtplib.SMTP('smtp.gmail.com', 587)
    mail = smtplib.SMTP_SSL('smtp.googlemail.com', 465)

    mail.login('pixelfreelancers@gmail.com','freelancers')
    mail.sendmail(me, you, msg.as_string())
    mail.quit()

    data = True
    return "Sent"

@api_blueprint.route('getElementbyCategory', methods=['GET'])
def getElementbyCategory():
    category=request.args.get('category')
    data =dict()
    #data['elements'] = ['/static/images/Elements/Balloons/numberedballoons01.png','/static/images/Elements/Balloons/numberedballoons02.png','/static/images/Elements/Balloons/numberedballoons03.png']
    data['elements']=database.GetElementByCategory(category)
    return Response(json.dumps(data, sort_keys=True, indent=4, separators=(',', ': ')), mimetype='text/json'), 200

@api_blueprint.route('insertorderDetails', methods=['GET'])
def insertorderDetails():
    location=request.args.get('location')
    venueSize=request.args.get('venueSize')
    eventdate=request.args.get('eventdate')
    eventtime=request.args.get('eventtime')
    duration=request.args.get('duration')
    geofilterType=request.args.get('geofilterType')
    email=request.args.get('email')
    data =""
    data=database.insertDetails(location,eventdate,email,venueSize,eventdate,eventtime,duration,geofilterType)
    return data
    
@api_blueprint.route('makePurchase', methods=['POST'])
def makePurchase():

    pdb.set_trace()
    data = request.json
    id  = data['payPalId']
    imgData = data['dataUrl'][22:]
    filename = 'Demo/static/orderimages/'+str(id)+'.png'  # Saving image with paypal Id as name
    with open(filename, 'wb') as f:
        f.write(imgData.decode('base64'))

    location = data['location']
    venueSize = data['venueSize']
    eventdate = data['eventdate']
    eventtime = data['eventtime']
    duration = data['duration']
    geofilterType = data['geofilterType']
    email = data['email']
    result =""
    result=database.insertDetails(location,eventdate,email,venueSize,eventtime,duration,geofilterType,filename,id)
    
    me ='pixelfreelancers@gmail.com'
    you =email

    # Create message container - the correct MIME type is multipart/alternative.
    msg = MIMEMultipart('alternative')
    msg['Subject'] = "Pixel"
    msg['From'] = me
    msg['To'] = you

    # Create the body of the message (a plain-text and an HTML version).
    text = "Thanks for placing order. Your orderid is "+str(result)+" and Your paypal payment id is "+str(id)
    part1 = MIMEText(text, 'plain')
    msg.attach(part1)
    # Send the message via local SMTP server.
    #mail = smtplib.SMTP('smtp.gmail.com', 587)
    mail = smtplib.SMTP_SSL('smtp.googlemail.com', 465)

    mail.login('pixelfreelancers@gmail.com','freelancers')
    mail.sendmail(me, you, msg.as_string())
    mail.quit()

    data = True

    return 200