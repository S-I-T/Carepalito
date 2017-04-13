from picamera.array import PiRGBArray
from picamera import PiCamera
import cv2
import time
import sys
import RPi.GPIO as GPIO

PORT = int(sys.argv[1])
DEBUG = False

if len(sys.argv) > 1 and sys.argv[2]=="--debug":
    DEBUG = True

GPIO.setmode(GPIO.BOARD)
GPIO.setup(PORT,GPIO.OUT)
p = GPIO.PWM(PORT,50)
v = 4
d = 5
s = 0.1
p.start(v)

WIDTH  = 160
HEIGHT = 120

camera = PiCamera()
camera.resolution = (WIDTH,HEIGHT)
camera.framerate = 2
rawCapture = PiRGBArray(camera, size=(WIDTH,HEIGHT))

#display_window = cv2.namedWindow("Faces")
face_cascade = cv2.CascadeClassifier('./haarcascade_frontalface_alt.xml')
time.sleep(1)

if DEBUG:
    display_window = cv2.namedWindow("Carepalo - Vision")

try:
    for frame in camera.capture_continuous(rawCapture, format="bgr", use_video_port=True):
        image = frame.array

        gray = cv2.cvtColor(image,cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.05, 1, cv2.cv.CV_HAAR_FIND_BIGGEST_OBJECT,(40, 40))
        if 0<len(faces):
            if DEBUG:
                for (x,y,w,h) in faces:
                    cv2.rectangle(image,(x,y),(x+w,y+h),(255,0,0),2)

            posY = (faces[0][1]*100)/HEIGHT;
            print posY
            deltaServo = v;
            if(posY > 50 + d):
                deltaServo += s;
            elif(posY < 50 - d):
                deltaServo -= s;

            if deltaServo != v:
                v = deltaServo
                p.ChangeDutyCycle(v)
                time.sleep(0.1)
        """
        print {"x":(faces[0][0]*100)/WIDTH,
               "y":(faces[0][1]*100)/HEIGHT,
               "w":(faces[0][2]*100)/WIDTH,
               "h":(faces[0][3]*100)/HEIGHT}
        sys.stdout.flush()
        """
        if DEBUG:
            cv2.imshow("Carepalo - Vision", image)
            key = cv2.waitKey(1)
            if key == 27:
                p.stop()
                GPIO.cleanup()
                camera.close()
                cv2.destroyAllWindows()
                break


        rawCapture.truncate(0)



except KeyboardInterrupt:
    p.stop()
    GPIO.cleanup()
    camera.close()
    cv2.destroyAllWindows()
