#!/bin/bash
#300*2 - 600 seconds
for i in {1..20}
do
    curl -s -X POST -H "Content-Type: application/json" --data @test/resources/survey.json http://192.168.44.100:3080/preview > ./op.json
    sleep 1
done