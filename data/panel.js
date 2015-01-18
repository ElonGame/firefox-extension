 var menu = document.getElementById("menu");
 menu.addEventListener('click', function(e) {
     if (e.target !== e.currentTarget) {
        self.port.emit(e.target.id);
     }
 });
