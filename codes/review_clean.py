# -*- coding: utf-8 -*-
"""
Created on Fri Apr 17 08:10:08 2020

@author: lzx3x3
"""

import pandas as pd
import numpy as np
import statistics

df = pd.read_csv('reviews_of_100_restaurants')
# df.photos = df.photos.replace('', 0)

df.friends = df.friends.str.extract('(\d+)')
df.number_reviews = df.number_reviews.str.extract('(\d+)')
df.photos = df.photos.str.extract('(\d+)')

df['area'] = df['area'].astype(str)
df['elite'] = df['elite'].astype(str)
df['area_AL'] = df.area.apply(lambda x: 1 if 'Atlanta' in x else 0)
df['elite_user'] = df.elite.apply(lambda x: 1 if 'Elite' in x else 0)

df['rating_mean'] = df.rating.groupby(df.restaurant_id).transform("mean")


dff = df[['user_id','restaurant_id','elite','rating','area_AL']].groupby('restaurant_id').agg({
        'user_id':['count'],
        'elite':['count'],
        'rating':['mean','median'],
         'area_AL':['count']
         })

#dff.standard_dev = statistics.stdev(df.rating.groupby(df.biz_id))
df['standard_dev'] = (df.rating-df.rating.groupby(df.restaurant_id).transform("mean"))/df.groupby(df.restaurant_id).count()

df[['restaurant_id','user_id','friends','number_reviews','photos','area_AL','elite_user','date','rating','rating_mean','standard_dev']].to_csv('review_100.csv')
dff.to_csv('review_summary.csv')