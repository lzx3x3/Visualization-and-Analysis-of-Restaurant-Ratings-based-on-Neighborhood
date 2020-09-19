# -*- coding: utf-8 -*-
import numpy as np
import pandas as pd
import pydot
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
# from sklearn.metrics import accuracy_score
from sklearn.ensemble import RandomForestRegressor


#features = pd.read_csv('restaurant_feature.csv')
features = pd.read_csv('restaurant_rf.csv')
features.describe()
features = features.drop('review_count', axis=1)

print(features.head(10))
#features.to_csv('restaurant_feature_rf.csv')

labels = np.array(features['average_rating'])

features = features.drop('average_rating', axis=1)
feature_list = list(features.columns)
features = np.array(features)

train_features, test_features, train_labels, test_labels = train_test_split(features, labels, test_size = 0.3, random_state = 0)

n = 100
rf = RandomForestRegressor(n_estimators = n, random_state = 0)
# Train the model on training data
rf.fit(train_features, train_labels);

# Use the forest's predict method on the test data
predictions = rf.predict(test_features)
# Calculate the absolute errors
errors = abs(predictions - test_labels)
# Print out the mean absolute error (mae)
print('n_estimators =',n)
print('Mean Absolute Error:',np.mean(errors))

#importances = rf.feature_importances_
#print(importances)

# Get numerical feature importances
importances = list(rf.feature_importances_)
# List of tuples with variable and importance
feature_importances = [(feature, round(importance, 4)) for feature, importance in zip(feature_list, importances)]
# Sort the feature importances by most important first
feature_importances = sorted(feature_importances, key = lambda x: x[1], reverse = True)
# Print out the feature and importances 
[print('Variable: {:20} Importance: {}'.format(*pair)) for pair in feature_importances];


# Set the style
plt.style.use('fivethirtyeight')
# list of x locations for plotting
x_values = list(range(len(importances)))
# Make a bar chart
plt.bar(x_values, importances, orientation = 'vertical')
# Tick labels for x axis
plt.xticks(x_values, feature_list, rotation='vertical')
# Axis labels and title
plt.ylabel('Importance'); plt.xlabel('Feature'); plt.title('Feature Importances');