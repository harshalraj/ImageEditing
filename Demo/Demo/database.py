import time
import os.path
#import pypyodbc
import pdb
import decimal
import pymysql.cursors

class Database:
    def __init__(self, con_str, static_folder):
        self.con_str = con_str
        self.static_folder = static_folder

    def connect(self):
        connection = pymysql.connect(host='localhost',
                             user='root',
                             password='',
                             db='hr',
                             charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor)
        return connection


    def GetImageUrl(self,category):
        #pdb.set_trace()
        if(category=='all'):
            GetUrl_Query = """select * from homeimageurl"""
            values = []
        else:
            GetUrl_Query = """select url,cost,c_url from imageurldetails where category=%s"""
            values = category
        db = self.connect()
        cur = db.cursor()
        cur.execute(GetUrl_Query, (values))
        result = cur.fetchall()
        cur.close()
        db.close()
        data=dict()
        url=[]
        cost=[]
        c_url=[]
        for i in result:
            url.append(i['url'])
            cost.append(i['cost'])
            c_url.append(i['c_url'])
        data['url']=url
        data['cost']=cost
        data['c_url']=c_url
        return data

    def GetCategory(self):
        GetUrl_Query = """select * from category"""
        values = []
        db = self.connect()
        cur = db.cursor()
        cur.execute(GetUrl_Query, (values))
        result = cur.fetchall()
        cur.close()
        db.close()
        data=dict()
        name=[]
        description=[]
        for i in result:
            name.append(i['name'])
            description.append(i['description'])
        #pdb.set_trace()
        data['name']=name
        data['description']=description
        return data
    def GetElementUrl(self):
        GetUrl_Query = """select url,category from elements"""
        values=[]
        db = self.connect()
        cur = db.cursor()
        cur.execute(GetUrl_Query, (values))
        result = cur.fetchall()
        cur.close()
        db.close()
        data=dict()
        balloons=[]
        decor=[]
        celebrations=[]
        numbers=[]
        banners=[]
        for i in result:
            if(i['category']=='Balloons'):
                balloons.append(i['url'])
            if(i['category']=='Banners'):
                banners.append(i['url'])
            if(i['category']=='Numbers'):
                numbers.append(i['url'])
            if(i['category']=='Celebrations'):
                celebrations.append(i['url'])
            if(i['category']=='Decor'):
                decor.append(i['url'])
        data['Balloons']=balloons
        data['Banners']=banners
        data['Numbers']=numbers
        data['Celebrations']=celebrations
        data['Decor']=decor
        #pdb.set_trace()
        return data
    def GetElementByCategory(self,category):
        values = category
        GetUrl_Query = "SELECT * FROM elementcategory WHERE url LIKE '%%%s%%'"% (values)
        db = self.connect()
        cur = db.cursor()
        cur.execute(GetUrl_Query)
        result = cur.fetchall()
        cur.close()
        db.close()
        elements_url=[]
        data=[]
        for i in result:
            elements_url.append(i['url'])
        data=elements_url
        #pdb.set_trace()
        return data
    def insertDetails(self,loc,eventdate,email_id,venueSize,eventtime,duration,geofilterType,filepath,paypalid):
        #pdb.set_trace()
        Insert_Query = """insert into orderdetails (location,event_date,email,venue_size,event_time,duration,filtertype,image_url,paypal_orderid) values (%s,%s,%s,%s,%s,%s,%s,%s,%s)"""
        Select_Query="""select order_id from orderdetails ORDER BY order_id DESC LIMIT 1"""
        db = self.connect()
        cur = db.cursor()
        cur.execute(Insert_Query,(loc,eventdate,email_id,venueSize,eventtime,duration,geofilterType,filepath,paypalid))
        db.commit()
        cur.close()
        db.close()
        db = self.connect()
        cur = db.cursor()
        cur.execute(Select_Query)
        result = cur.fetchall()
        data=""
        for i in result:
            data+=str(i['order_id'])
        cur.close()
        db.close()
        return data
    def getOrderId(self):
        Select_Query="""select order_id from orderdetails ORDER BY order_id DESC LIMIT 1"""
        db = self.connect()
        cur = db.cursor()
        cur.execute(Select_Query)
        result = cur.fetchall()
        data=""
        for i in result:
            data+=str(i['order_id'])
        cur.close()
        db.close()
        return data
    
