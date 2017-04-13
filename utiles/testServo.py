import RPi.GPIO as GPIO    #Importamos la libreria RPi.GPIO
import time                #Importamos time para poder usar time.sleep
import sys,tty,termios
           #Enviamos un pulso del 7.5% para centrar el servo

class _Getch:
    def __call__(self):
            fd = sys.stdin.fileno()
            old_settings = termios.tcgetattr(fd)
            try:
                tty.setraw(sys.stdin.fileno())
                ch = sys.stdin.read(3)
            finally:
                termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)
            return ch

def get():
        inkey = _Getch()
        while(1):
                k=inkey()
                if k!='':break
        if k=='\x1b[A':
                return "up"
        elif k=='\x1b[B':
                return "down"
        elif k=='\x1b[C':
                print "exit"
        return ""

GPIO.setmode(GPIO.BOARD)   #Ponemos la Raspberry en modo BOARD
GPIO.setup(33,GPIO.OUT)    #Ponemos el pin 21 como salida
p = GPIO.PWM(33,50)        #Ponemos el pin 21 en modo PWM y enviamos 50 pulsos por segundo
v = 4;
p.start(v)

try:
    while True:      #iniciamos un loop infinito
        k = get()
        m = False

        if k == "up":
            v+=0.1
            m = True
        elif k=="down":
            v-=0.1
            m = True
        elif k=="exit":
            p.stop()                      #Detenemos el servo
            GPIO.cleanup()
            sys.exit()

        if m:
            print k,v
            p.ChangeDutyCycle(v)    #Enviamos un pulso del 4.5% para girar el servo hacia la izquierda
            time.sleep(0.1)           #pausa de medio segundo


except KeyboardInterrupt:         #Si el usuario pulsa CONTROL+C entonces...
    p.stop()                      #Detenemos el servo
    GPIO.cleanup()                #Limpiamos los pines GPIO de la Raspberry y cerramos el script
