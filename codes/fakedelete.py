# -*- coding: utf-8 -*-
"""
Created on Sat Apr 18 01:22:14 2020

@author: lzx3x3
"""
import pandas as pd

df2 = pd.read_csv('review_100_fake.csv')


dff=df2[df2.id == '0']
dff.to_csv('review_100_fake_delete.csv')

dff.friends = dff.friends.str.extract('(\d+)')
dff.number_reviews = dff.number_reviews.str.extract('(\d+)')
dff.photos = dff.photos.str.extract('(\d+)')

dff['area'] = dff['area'].astype(str)
dff['elite'] = dff['elite'].astype(str)
dff['area_AL'] = dff.area.apply(lambda x: 1 if 'Atlanta' in x else 0)
dff['elite_user'] = dff.elite.apply(lambda x: 1 if 'Elite' in x else 0)

dff['rating_mean'] = dff.rating.groupby(dff.biz_id).transform("mean")
dff['rating_dev'] = (dff.rating-dff.rating.groupby(dff.biz_id).transform("mean"))/dff.rating.groupby(dff.biz_id).transform("mean")

dff[['biz_id','user_id','friends','number_reviews','photos','area_AL','elite_user','date','rating','rating_mean','rating_dev']].to_csv('review_100_fakeclean.csv')
