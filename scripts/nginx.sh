sudo cp conf.nginx /etc/nginx/sites-available/api.customer_name.qraxiss.com

sudo ln -s /etc/nginx/sites-available/api.customer_name.qraxiss.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx