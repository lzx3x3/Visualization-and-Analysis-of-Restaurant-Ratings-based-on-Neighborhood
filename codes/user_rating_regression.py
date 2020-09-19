# -*- coding: utf-8 -*-
"""
Created on Fri Apr 17 19:29:33 2020

@author: lzx3x3
"""

import numpy as np
import pandas as pd
import pydot
from sklearn.model_selection import cross_val_score, GridSearchCV, cross_validate, train_test_split
from sklearn.metrics import accuracy_score
from sklearn.svm import SVR
from sklearn.linear_model import LinearRegression
from sklearn import datasets, linear_model
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler, normalize
from sklearn import metrics

features = pd.read_csv('review_fakeclean_rf.csv')
print(features.head(10))
features.describe()
features = pd.get_dummies(features)

labels = np.array(features['y'])

features = features.drop('y', axis=1)
feature_list = list(features.columns)
features = np.array(features)

train_features, test_features, train_labels, test_labels = train_test_split(features, labels, test_size = 0.3, random_state = 42)

# Instantiate model with 1000 decision trees
rf = RandomForestRegressor(n_estimators = 20, random_state = 42)
# Train the model on training data
rf.fit(train_features, train_labels);

# Use the forest's predict method on the test data
predictions = rf.predict(test_features)
# Calculate the absolute errors
errors = abs(predictions - test_labels)
# Print out the mean absolute error (mae)
print('Mean Absolute Error:',np.mean(errors))

importances = rf.feature_importances_
print(importances)
# -------------------------------

# TODO: Sort them in the descending order and print the feature numbers[0 to ...].
#       Hint: There is a direct function available in sklearn to achieve this. Also checkout argsort() function in Python.
# XXX

# -------------------------------
# ADD CODE HERE
# Requires a print() statement
indices = np.argsort(importances)[::-1]
print(indices)

# Import tools needed for visualization
from sklearn.tree import export_graphviz


# Pull out one tree from the forest
# Limit depth of tree to 3 levels
rf_small = RandomForestRegressor(n_estimators=20, max_depth = 5)
rf_small.fit(train_features, train_labels)
# Extract the small tree
tree_small = rf_small.estimators_[5]
# Save the tree as a png image
export_graphviz(tree_small, out_file = 'small_tree.dot', feature_names = feature_list, rounded = True, precision = 1)
(graph, ) = pydot.graph_from_dot_file('small_tree.dot')
graph.write_png('small_tree.png');

# Get numerical feature importances
importances = list(rf.feature_importances_)
# List of tuples with variable and importance
feature_importances = [(feature, round(importance, 2)) for feature, importance in zip(feature_list, importances)]
# Sort the feature importances by most important first
feature_importances = sorted(feature_importances, key = lambda x: x[1], reverse = True)
# Print out the feature and importances 
[print('Variable: {:20} Importance: {}'.format(*pair)) for pair in feature_importances];


# Import matplotlib for plotting and use magic command for Jupyter Notebooks
#import matplotlib.pyplot as plt
# Set the style
#plt.style.use('fivethirtyeight')
# list of x locations for plotting
#x_values = list(range(len(importances)))
# Make a bar chart
#plt.bar(x_values, importances, orientation = 'vertical')
# Tick labels for x axis
#plt.xticks(x_values, feature_list, rotation='vertical')
# Axis labels and title
#plt.ylabel('Importance'); plt.xlabel('Variable'); plt.title('Variable Importances');