#!/bin/bash

find . \( -name node_modules -prune \) -o -name "*.js" -exec grep -i -n 'getComuneInfoByCodComune' {} \; -print
