# Single Stat Math Panel

This panel is a modification of the native single stat panel to support math functions across series.

### Usage

### InfluxDB

To use the math feature, give the series an alias by name and use that name inside the math field as variables. 

![Image of using InfluxDB metric](https://raw.github.com/black-mirror-1/singlestat-math/master/src/img/readme/influx_metric.png)

In the math field you can use the alias names to perform math across series.

![Image of using math field](https://raw.github.com/black-mirror-1/singlestat-math/master/src/img/readme/math_field.png)

## Changelog

## 1.1.1
* Changed function evaluation error handling to set results to zero

## 1.1.0
* Fixed missing flot library crashing graph panel.
* Updated dependencies.

## 1.0.0

* Added math options if multiple queries are used.
* Math field will use series alias name to evaluate function. 
