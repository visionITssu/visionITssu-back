import cv2, dlib
from imutils import face_utils
import numpy as np
import base64
import sys
from datetime import datetime
from PIL import Image,ImageFile
from rembg import remove

def show_rembg(cv_img):
    color_coverted = cv2.cvtColor(cv_img, cv2.COLOR_BGR2RGB)
    pil_image=Image.fromarray(color_coverted)
    output = remove(pil_image)
    img = output.convert("RGBA")

    # 새로운 흰색 배경 이미지 생성
    white_bg = Image.new("RGBA", img.size, "WHITE")
    white_bg.paste(img, (0, 0), img)
    # use numpy to convert the pil_image into a numpy array
    numpy_image=np.array(white_bg)  
    # convert to a openCV2 image and convert from RGB to BGR format
    opencv_image=cv2.cvtColor(numpy_image, cv2.COLOR_RGB2BGR)
    #display image to GUI
    return opencv_image


predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")
detector = dlib.get_frontal_face_detector()

#REAL CODE
# img_data = base64.b64decode(sys.argv[1])
# nparr = np.frombuffer(img_data, np.uint8)
# image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

image = cv2.imread(str(sys.argv[1])) #TEST CODE

if image is None:
    print('Image is Empty!')
    exit()

gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
rects = detector(gray, 0)  # 얼굴 개수
# number of faces on the frame
if len(rects) > 0:
    for rect in rects:
        (bX, bY, bW, bH) = face_utils.rect_to_bb(rect)
        shape = predictor(gray, rect)
        gx_out = 0;
        gy_out = 0;
        gx_in = 0;
        gy_in = 0
        num_of_points_out=17
        num_of_points_in = shape.num_parts - num_of_points_out
        for i in range(shape.num_parts):  # 총 68개
            shape_point = shape.part(i)
            if i < num_of_points_out:  # 얼굴 라인
                gx_out = gx_out + shape_point.x / num_of_points_out
                gy_out = gy_out + shape_point.y / num_of_points_out

            else:  # 얼굴 기관
                gx_in = gx_in + shape_point.x / num_of_points_in
                gy_in = gy_in + shape_point.y / num_of_points_in
        
    center_x = int(gx_in)
    center_y = int(gy_in)
    crop = image[center_y - 170:center_y + 170, center_x - 132:center_x + 132]
    dst = show_rembg(crop)
    result = cv2.resize(dst, dsize=(413, 531), interpolation=cv2.INTER_LANCZOS4)
    #timestamp지워도 상관없음, 파일 저장하는 부분
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"image_{timestamp}.jpg"
    cv2.imwrite(filename, result)
else:
    print('no')