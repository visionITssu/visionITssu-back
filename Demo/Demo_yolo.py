import cv2, dlib, math
import torch

predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")
detector = dlib.get_frontal_face_detector()

model = torch.hub.load('ultralytics/yolov5', 'custom',path="yolo_earphone.pt")
cap = cv2.VideoCapture(0) #카메라 접근 방식에 따라 수정 필요
model.conf=0.5

# k: 얼굴 인덱스, d: 얼굴 좌표
while cv2.waitKey(33)<0:
    ret, frame = cap.read()
    dets = detector(frame, 1)
    results=model(frame)
    # print(results.pandas().xyxy[0] )
    for k, d in enumerate(dets):
        shape = predictor(frame, d) #총 68개의 점

        # 얼굴 영역 표시
        ## 색깔
        color_f = (0, 0, 255)  # face - 빨강
        color_l_out = (255, 0, 0)  # 랜드마크 바깥쪽(out) - 파랑
        color_l_in = (0, 255, 0)  # 랜드마크 안쪽(in) - 초록
        ## 표시할 선, 도형
        line_width = 2
        circle_r = 2
        ## 글씨
        fontType = cv2.FONT_HERSHEY_SIMPLEX
        fontSize = 1

        # 얼굴(detector)에 사각형 그림
        # cv2.rectangle(frame, (d.left(), d.top()), (d.right(), d.bottom()), color_f, line_width)

        #17번까지 얼굴 하관 라인, 그 이후는 각 기관 랜드마크
        num_of_points_out = 17
        num_of_points_in = shape.num_parts - num_of_points_out
        gx_out = 0;
        gy_out = 0;
        gx_in = 0;
        gy_in = 0


        for i in range(shape.num_parts):  # 총 68개
            shape_point = shape.part(i)
            #print('얼굴 랜드마크 No.{} 좌표위치: ({}, {})'.format(i, shape_point.x, shape_point.y))


            if i < num_of_points_out: #얼굴 라인
                # cv2.circle(frame, (shape_point.x, shape_point.y), circle_r, color_l_out, line_width)
                gx_out = gx_out + shape_point.x / num_of_points_out
                gy_out = gy_out + shape_point.y / num_of_points_out

            else: #얼굴 기관
                # cv2.circle(frame, (shape_point.x, shape_point.y), circle_r, color_l_in, line_width)
                gx_in = gx_in + shape_point.x / num_of_points_in
                gy_in = gy_in + shape_point.y / num_of_points_in

        # 얼굴 라인 중심
        # cv2.circle(frame, (int(gx_out), int(gy_out)), circle_r, (0, 0, 255), line_width)
        # 얼굴 기관 중심
        # cv2.circle(frame, (int(gx_in), int(gy_in)), circle_r, (0, 0, 0), line_width)

        # 얼굴 방향 계산
        theta = math.asin(2 * (gx_in - gx_out) / (d.right() - d.left()))
        radian = theta * 180 / math.pi

        #print('얼굴방향: {0:.3f} (각도: {1:.3f}도)'.format(theta, radian))

        # 결과값 전송 어떤 형식으로 해야하는지 논의 필요(일단 정면이면 1, 아니면 0 출력하도록 함)
        threshold = 1.5
        result=0
        if radian < threshold and radian > -threshold:
            textPrefix = 'front'
            result=1

        else:
            textPrefix = 'none'
            result=0
        # elif radian <-threshold:
        #     textPrefix = 'right'
        #     result=0
        # elif radian >threshold:
        #     textPrefix = 'left'
        #     result=0
        print('\n',result)
        textShow = textPrefix + str(round(abs(radian), 1)) + " deg."
        cv2.putText(frame, textShow, (d.left(), d.top()), fontType, fontSize, color_f, line_width)

    cv2.imshow('Demo', frame)

cap.release()
cv2.destroyAllWindows()

