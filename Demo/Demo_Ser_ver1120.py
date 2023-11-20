import cv2, dlib, math
from imutils import face_utils
import numpy as np
import base64
import sys

def check_frontal(image):  # image is PIL
    frame = np.array(image)
    frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    # detect faces in the grayscale frame
    rects = detector(gray, 0)  # 얼굴 개수

    # number of faces on the frame
    if len(rects) > 0:
        # loop over the face detections
        for rect in rects:
            (bX, bY, bW, bH) = face_utils.rect_to_bb(rect)

            shape = predictor(gray, rect)
            shape_np = face_utils.shape_to_np(shape)

            num_of_points_out = 17  # 17번까지 얼굴 하관 라인
            num_of_points_in = shape.num_parts - num_of_points_out
            gx_out = 0;
            gy_out = 0;
            gx_in = 0;
            gy_in = 0

            for i in range(shape.num_parts):  # 총 68개
                shape_point = shape.part(i)
                if i < num_of_points_out:  # 얼굴 라인
                    gx_out = gx_out + shape_point.x / num_of_points_out
                    gy_out = gy_out + shape_point.y / num_of_points_out

                else:  # 얼굴 기관
                    gx_in = gx_in + shape_point.x / num_of_points_in
                    gy_in = gy_in + shape_point.y / num_of_points_in

            # 얼굴 방향 계산
            theta = math.asin(2 * (gx_in - gx_out) / (rect.right() - rect.left()))
            radian = theta * 180 / math.pi
            threshold = 1.5
            if radian < threshold and radian > -threshold:
                print("1")
            else:
                print("0")

predictor = dlib.shape_predictor("/Users/byeon-eun-yeong/Desktop/visionITssu-back/Demo/shape_predictor_68_face_landmarks.dat")
detector = dlib.get_frontal_face_detector()

#cap = cv2.VideoCapture(0) #카메라 접근 방식에 따라 수정 필요
encoded_data = sys.argv[1]
decoded_data = base64.b64decode(encoded_data)

image_nparray = np.frombuffer(decoded_data, dtype=np.uint8)
image = cv2.imdecode(image_nparray, cv2.IMREAD_COLOR)
#image = cv2.imread(image)
print("image 생성완료")
check_frontal(image)

