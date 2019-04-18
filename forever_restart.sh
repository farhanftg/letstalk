if forever list | grep -v "grep" | grep "vahan_scrapper"
then
    forever stop "vahan_scrapper"
    echo 'stopped'
fi
forever --minUptime 5000 --uid "vahan_scrapper" -a start server.js

