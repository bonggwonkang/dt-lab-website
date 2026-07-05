import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '../LanguageContext'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }

const base = import.meta.env.BASE_URL

const items = [
  // ── 2026 ────────────────────────────────────────────────────────────────
  { date: '2026', type: 'journal', img: '38.png',
    title: 'New paper accepted in International Journal of Production Research',
    titleKo: '국제 생산연구 저널(IJPR) 논문 게재 확정',
    desc: '"Uncertainty-aware simulation optimization for yard template planning in transshipment hubs", authors: Kang, Bonggwon; Lee, Taehoon; Sun, Zhuo; Hong, Soondo. Abstract) Yard template planning (YTP) is commonly applied at transshipment hubs to reduce transportation costs by assigning storage areas for outbound vessels. With recent advances in digital transformation technologies, terminal operators increasingly rely on simulation-based decision-making to address the uncertain nature of port operations. However, high-fidelity container terminal simulations typically require several minutes to hours per run, and YTP involves a high-dimensional and combinatorial design space. To address these challenges, we propose a domain-informed parallel Bayesian optimisation framework. A Gaussian process (GP) surrogate is presented to efficiently approximate the posterior distribution of terminal performance, thereby enhancing an uncertainty-aware balance between exploration and exploitation. We further integrate a large neighbourhood search (LNS) with the surrogate to navigate the combinatorial design space in parallel. Experimental results show that the proposed approach improves average prediction accuracy by 14.89% and 23.42% over two standard GP surrogates and reduces average vehicle travel time by 4.15%, 1.47%, and 3.27% compared with two Bayesian optimisation approaches and the LNS-based simulation optimisation approach, respectively.',
    descKo: '"환적 허브 야드 템플릿 계획을 위한 불확실성 인식 시뮬레이션 최적화", 저자: 강봉권, 이태훈, Sun Zhuo, 홍순도. 초록) 야드 템플릿 계획(YTP)은 환적 허브에서 외항 선박의 저장 구역을 배정하여 운송 비용을 절감하는 데 활용됩니다. 디지털 전환 기술의 발전으로 터미널 운영자들은 항만 운영의 불확실성에 대처하기 위해 시뮬레이션 기반 의사결정에 점점 더 의존하고 있습니다. 그러나 고충실도 컨테이너 터미널 시뮬레이션은 보통 수 분에서 수 시간이 소요되며, YTP는 고차원의 조합적 설계 공간을 가집니다. 이러한 문제를 해결하기 위해 도메인 지식 기반의 병렬 베이지안 최적화 프레임워크를 제안합니다. 가우시안 프로세스(GP) 서로게이트를 통해 터미널 성능의 사후 분포를 효율적으로 근사하여 탐색과 활용의 균형을 향상시켰습니다. 또한 대규모 이웃 탐색(LNS)을 서로게이트와 통합하여 병렬로 조합적 설계 공간을 탐색합니다. 실험 결과, 제안 방법은 두 개의 표준 GP 서로게이트 대비 평균 예측 정확도를 각각 14.89%, 23.42% 향상시키고, 두 개의 베이지안 최적화 방법 및 LNS 기반 시뮬레이션 최적화 대비 평균 차량 이동 시간을 4.15%, 1.47%, 3.27% 단축하였습니다.',
  },
  { date: '2026.06', type: 'conference', img: '37.jpg',
    title: '2026 KIIE Spring Conference',
    titleKo: '2026 대한산업공학회 춘계학술대회 참가',
    desc: 'Attended the 2026 Spring Conference of the Korean Institute of Industrial Engineers (KIIE), Seoul, Korea.',
    descKo: '서울에서 개최된 대한산업공학회(KIIE) 2026년 춘계학술대회에 참가하였습니다.' },
  { date: '2026.05', type: 'conference', img: '36.jpg',
    title: 'Invited Talk at the Korean Reliability Society (KORAS) Emerging Researcher Session',
    titleKo: '한국신뢰성학회(KORAS) 신진연구자 세션 초청 발표',
    desc: 'Invited presentation at the Korean Reliability Society (KORAS) emerging researcher session on simulation-based calibration for automated material handling systems.',
    descKo: '한국신뢰성학회(KORAS) 신진연구자 세션에서 자동화 물류 시스템의 시뮬레이션 기반 캘리브레이션에 관한 초청 발표를 진행하였습니다.' },
  { date: '2026.05', type: 'conference', img: '35.jpeg',
    title: '2026 KSIE Conference',
    titleKo: '2026 한국산업시스템학회 학술대회 참가',
    desc: 'Attended the 2026 Conference of the Korean Society for Industrial and Systems Engineering (KSIE), Korea.',
    descKo: '2026년 한국산업시스템학회(KSIE) 학술대회에 참가하였습니다.' },
  // ── 2025 ────────────────────────────────────────────────────────────────
  { date: '2025.09', type: 'journal', img: '34.png',
    title: 'New paper has been accepted for publication in Technometrics',
    titleKo: 'Technometrics 논문 게재 확정',
    desc: '"Active Learning of Piecewise Gaussian Process Surrogates" has been accepted for publication in Technometrics. Abstract) Active learning of Gaussian process (GP) surrogates has been useful for optimizing experimental designs for physical/computer simulation experiments, and for steering data acquisition schemes in machine learning. In this paper, we develop a method for active learning of piecewise, Jump GP surrogates. Jump GPs are continuous within, but discontinuous across, regions of a design space, as required for applications spanning autonomous materials design, configuration of smart factory systems, and many others. Although our active learning heuristics are appropriated from strategies originally designed for ordinary GPs, we demonstrate that additionally accounting for model bias, as opposed to the usual model uncertainty, is essential in the Jump GP context. Toward that end, we develop an estimator for bias and variance of Jump GP models. Illustrations, and evidence of the advantage of our proposed methods, are provided on a suite of synthetic benchmarks, and real-simulation experiments of varying complexity.',
    descKo: '"점진적 가우시안 프로세스 서로게이트의 능동 학습(Active Learning of Piecewise Gaussian Process Surrogates)"이 Technometrics에 게재 확정되었습니다. 초록) 가우시안 프로세스(GP) 서로게이트의 능동 학습은 물리/컴퓨터 시뮬레이션 실험의 설계 최적화와 머신러닝의 데이터 수집 전략에 유용하게 활용됩니다. 본 논문에서는 점진적 Jump GP 서로게이트의 능동 학습 방법을 개발합니다. Jump GP는 설계 공간 내 영역 안에서는 연속적이지만 영역 간에는 불연속적이며, 이는 자율 소재 설계, 스마트 팩토리 시스템 구성 등 다양한 응용에 필요합니다. 기존 GP용 전략을 활용하면서도, Jump GP 맥락에서는 모델 불확실성보다 모델 편향을 추가로 고려하는 것이 필수적임을 보입니다. 이를 위해 Jump GP 모델의 편향 및 분산 추정량을 개발하였습니다.',
    url: 'https://www.tandfonline.com/doi/full/10.1080/00401706.2025.2561746' },
  { date: '2025.09', type: 'book', img: '33.jpg',
    title: 'New Book Publication Announcement',
    titleKo: '신간 도서 출판 안내',
    desc: 'We are pleased to announce the publication of a new book authored by Professor Bonggwon Kang, now available through Kyobo Book Centre. Title: Production Logistics System: Simulation Modeling. Author: Bonggwon Kang. Publisher: Kyobo Book Centre. This book provides a comprehensive introduction to discrete-event simulation modeling with a particular focus on production and logistics systems. Grounded in practical experiences from semiconductor and display industries, it offers both key concepts and techniques for digital twin applications. The book is intended as a practical resource for researchers, undergraduate students, and industry practitioners who wish to build simulation models, analyze system performance, and apply simulation-based insights to manufacturing and logistics environments.',
    descKo: '강봉권 교수가 저술한 신간 도서가 교보문고를 통해 출판되었습니다. 제목: 생산물류시스템: 시뮬레이션 모델링. 저자: 강봉권. 출판사: 교보문고. 이 책은 반도체 및 디스플레이 산업의 실무 경험을 바탕으로 생산 및 물류 시스템에 초점을 맞춘 이산 사건 시뮬레이션 모델링을 소개합니다. 디지털 트윈 응용을 위한 핵심 개념과 기법을 제공하며, 연구자, 학부생, 산업 실무자를 위한 실용적인 자료입니다.',
    url: 'https://ebook-product.kyobobook.co.kr/dig/epd/ebook/E000011944783' },
  { date: '2025.06', type: 'conference', img: '32.jpg',
    title: 'Presentation at the 2025 Spring KIIE Conference',
    titleKo: '2025 대한산업공학회 춘계학술대회 발표',
    desc: 'I delivered a presentation at the Spring KIIE Conference in Seoul, South Korea, titled "Bias-aware simulation calibration for an automated material handling system in a semiconductor fab".',
    descKo: '서울에서 개최된 대한산업공학회 춘계학술대회에서 "반도체 팹 자동화 물류 시스템의 편향 인식 시뮬레이션 캘리브레이션"을 주제로 발표하였습니다.' },
  { date: '2025.04', type: 'journal', img: '31.png',
    title: 'New paper has been accepted for publication in Journal of Manufacturing Systems',
    titleKo: 'Journal of Manufacturing Systems 논문 게재 확정',
    desc: '"A digital twin calibration for an automated material handling system in a semiconductor fab" has been accepted for publication in Journal of Manufacturing Systems, a well-regarded journal in the Operations Research and Management Science field. Abstract) To address the complex, dynamic, and stochastic nature of an automated material handling system (AMHS) in a semiconductor fabrication facility (fab), practitioners have used a high-fidelity discrete-event simulation as its digital twin model for decision-making over several decades. Previous studies have focused on fast digital twin-based decision-making in AMHSs under the assumption that their digital twin models are credible enough to prescribe decisions. However, parameter uncertainty and intrinsic model bias in an AMHS digital twin model can lead to an inaccurate representation of its field system. To address the challenge, this paper introduces the Bayesian calibration, which modularly estimates a digital twin outcome and its discrepancy using Gaussian process priors.',
    descKo: '"반도체 팹 자동화 물류 시스템(AMHS)의 디지털 트윈 캘리브레이션"이 Journal of Manufacturing Systems에 게재 확정되었습니다. 초록) 반도체 팹에서 AMHS의 복잡하고 동적이며 확률적인 특성을 다루기 위해, 실무자들은 수십 년간 고충실도 이산 사건 시뮬레이션을 디지털 트윈 모델로 활용해 왔습니다. 기존 연구들은 디지털 트윈 모델이 충분히 신뢰할 수 있다는 가정 하에 빠른 의사결정에 집중했습니다. 그러나 파라미터 불확실성과 AMHS 디지털 트윈 모델의 내재적 편향은 현장 시스템을 부정확하게 표현할 수 있습니다. 이 문제를 해결하기 위해 가우시안 프로세스 사전분포를 사용하여 디지털 트윈 결과와 불일치를 모듈식으로 추정하는 베이지안 캘리브레이션을 소개합니다.',
    url: 'https://www.sciencedirect.com/science/article/pii/S0278612525001049' },
  { date: '2025.03', type: 'journal', img: '30.png',
    title: 'Paper publication in the Journal of the Korea Society for Simulation',
    titleKo: '한국시뮬레이션학회지 논문 게재',
    desc: '"A Comparative Study of Surrogate Models for Simulation-based Yard Template Planning in a Container Terminal" was published in the Journal of the Korea Society for Simulation. Abstract) Yard template planning is the decision-making process of allocating sub-blocks to specific groups of containers based on consignment strategies. Simulation-based decision-making has been used to evaluate and optimize yard template plans for upcoming maritime demand. However, the increased complexity and scale of port operations require a high-fidelity simulation model which takes substantial time for a computational evaluation of a yard template candidate. To address the difficulty, this study proposes a surrogate-based decision-making procedure to replace an expensive-to-evaluate simulation with a prediction model. We also introduce four commonly used surrogate models, Artificial Neural Networks, Random Forest, Gaussian Process, and Support Vector Regression, and compare their performances across various terminal operating scenarios.',
    descKo: '"컨테이너 터미널 시뮬레이션 기반 야드 템플릿 계획을 위한 서로게이트 모델 비교 연구"가 한국시뮬레이션학회지에 게재되었습니다. 초록) 야드 템플릿 계획은 위탁 전략에 따라 특정 컨테이너 그룹에 서브블록을 배정하는 의사결정 과정입니다. 시뮬레이션 기반 의사결정이 야드 템플릿 최적화에 활용되고 있으나, 항만 운영의 복잡성과 규모로 인해 상당한 계산 시간이 필요합니다. 이를 해결하기 위해 비용이 큰 시뮬레이션을 예측 모델로 대체하는 서로게이트 기반 의사결정 절차를 제안하고, 인공신경망, 랜덤 포레스트, 가우시안 프로세스, 서포트 벡터 회귀의 성능을 다양한 운영 시나리오에서 비교하였습니다.' },
  { date: '2025.02', type: 'patent', img: '29.png',
    title: 'Patent Registration Update',
    titleKo: '특허 등록',
    desc: 'We are pleased to announce that our patent titled "Method and Apparatus for Deriving Management Policy of Vehicles" has been officially registered in March 2025. Patent Holders: S. Hong, B. Kang. Patent Type: Korean Patent. Funding Source: Research and Business Development Foundation, Pusan National University. This patent introduces an innovative method and system for optimizing vehicle management policies, enhancing efficiency and decision-making in transportation systems.',
    descKo: '"차량 관리 정책 도출 방법 및 장치" 특허가 2025년 3월 공식 등록되었습니다. 특허권자: 홍순도, 강봉권. 특허 유형: 국내 특허. 재원: 부산대학교 연구사업화재단. 이 특허는 교통 시스템에서 효율성과 의사결정을 향상시키는 혁신적인 차량 관리 정책 최적화 방법 및 시스템을 제안합니다.' },
  { date: '2025.01.31–02.06', type: 'collaboration', img: '28.jpg',
    title: 'The 4th Joint Workshop on the Recent Digital Twin and Production Logistics Research at the University of Washington',
    titleKo: '워싱턴대학교 제4회 디지털 트윈 및 생산물류 연구 공동 워크숍',
    desc: 'I participated in the joint meeting on the recent digital twin research and simulation education at the University of Washington from January 31st to February 6th. A couple of meetings on the research topics regarding digital twin constructions were conducted.',
    descKo: '1월 31일부터 2월 6일까지 워싱턴 대학교에서 개최된 디지털 트윈 연구 및 시뮬레이션 교육 관련 공동 회의에 참가하였습니다. 디지털 트윈 구성 관련 연구 주제에 대한 다양한 논의가 이루어졌습니다.' },
  // ── 2024 ────────────────────────────────────────────────────────────────
  { date: '2024.12', type: 'journal', img: '27.png',
    title: 'Paper publication in the Journal of the Korean Society of Supply Chain Management',
    titleKo: '한국SCM학회지 논문 게재',
    desc: '"A Simulation Study of the Vehicle Repositioning Policy with the Minimum and Maximum Service Levels in a Demand Responsive Transit System" was published in the Journal of the Korean Society of Supply Chain Management. Abstract) Public transportation faces challenges due to the depopulation in rural areas and the increase in unprofitable routes caused by population polarization. Demand responsive transit has emerged to provide flexible public transit services tailored to various demand patterns. In this study, we present the vehicle repositioning policy based on the minimum and maximum service levels. The proposed policy is to adjust the service levels of each station for a prompt reaction to transit requests. To consider system complexity and dynamics, we develop a discrete-event simulation model and comparatively investigate the impact of the vehicle repositioning policy on operational performance.',
    descKo: '"수요 반응형 대중교통 시스템에서 최소·최대 서비스 수준에 기반한 차량 재배치 정책에 관한 시뮬레이션 연구"가 한국SCM학회지에 게재되었습니다. 초록) 대중교통은 농촌 지역의 인구 감소와 인구 집중으로 인한 비수익 노선 증가로 어려움을 겪고 있습니다. 수요 반응형 대중교통은 다양한 수요 패턴에 맞춰 유연한 대중교통 서비스를 제공하기 위해 등장했습니다. 본 연구에서는 최소·최대 서비스 수준에 기반한 차량 재배치 정책을 제안하고, 이산 사건 시뮬레이션 모델을 개발하여 운영 성능에 미치는 영향을 비교 분석합니다.' },
  { date: '2024.12.11', type: 'conference', img: '26.jpg',
    title: 'Presentation at Hanwha Ocean',
    titleKo: '한화오션 발표',
    desc: 'I gave a talk at Hanwha Ocean in Geoje, titled "Recent Research on Digital Twin Construction: A Perspective of Management Science". We had discussions about current operational issues in the Shipbuilding Industry with field practitioners and a research direction to provide reliable production schedules considering numerous combinatorial constraints.',
    descKo: '경남 거제 한화오션에서 "디지털 트윈 구성 관련 최근 연구: 경영과학적 관점"을 주제로 강연하였습니다. 조선 산업 현장 전문가들과 현재 운영 문제 및 수많은 조합적 제약을 고려한 신뢰할 수 있는 생산 일정 제공을 위한 연구 방향을 논의하였습니다.' },
  { date: '2024.10.26', type: 'conference', img: '25.png',
    title: 'Presentation at the 2024 Fall KIIE Conference',
    titleKo: '2024 대한산업공학회 추계학술대회 발표',
    desc: 'I delivered a presentation at the Fall KIIE Conference in Seoul, South Korea, titled "Discrete-event Simulation Calibration for a Large-scale Material Handling System: A Case Study of a Semiconductor Fab". This research highlights the use of Bayesian calibration for digital twin construction in an automated material handling system within a semiconductor fab. I sincerely thank Professor Park, Professor Kim, and Professor Hong for their valuable feedback on this research!',
    descKo: '서울에서 개최된 대한산업공학회 추계학술대회에서 "대규모 물류 시스템의 이산 사건 시뮬레이션 캘리브레이션: 반도체 팹 사례 연구"를 발표하였습니다. 이 연구는 반도체 팹 AMHS의 디지털 트윈 구성을 위한 베이지안 캘리브레이션 활용을 다룹니다. 박 교수님, 김 교수님, 홍 교수님의 소중한 피드백에 깊이 감사드립니다.' },
  { date: '2024.10.21', type: 'conference', img: '24.jpg',
    title: 'Presentation at the 2024 INFORMS Annual Meeting',
    titleKo: '2024 INFORMS 연례 학술대회 발표',
    desc: 'I gave an invited talk at the 2024 INFORMS Annual Meeting in Seattle, titled "Modular Calibration of a Digital Twin Model for Planning-Level Decision-Making in a Semiconductor Fab\'s AMHS." I appreciate Professor Park\'s support for this opportunity.',
    descKo: '시애틀에서 개최된 2024 INFORMS 연례 학술대회에서 "반도체 팹 AMHS 계획 수준 의사결정을 위한 디지털 트윈 모델의 모듈식 캘리브레이션"을 주제로 초청 발표하였습니다. 이 기회를 마련해 주신 박 교수님께 감사드립니다.' },
  { date: '2024.10.20', type: 'collaboration', img: '23.jpg',
    title: 'The 3rd Joint Workshop on the Recent Digital Twin and Production Logistics Research at the University of Washington',
    titleKo: '워싱턴대학교 제3회 디지털 트윈 및 생산물류 연구 공동 워크숍',
    desc: 'The 3rd Joint Workshop on Recent Digital Twin and Production Logistics Research (DTPL) was held on October 20, 2024, at the University of Washington. Attendees: Dr. Bonggwon Kang, Mr. Bosung Kim, Prof. Soondo Hong, and Prof. Chiwoo Park. During the workshop, we had in-depth discussions on future collaborative plans related to digital twin calibration approach.',
    descKo: '2024년 10월 20일 워싱턴 대학교에서 제3회 디지털 트윈 및 생산물류 연구(DTPL) 공동 워크숍이 개최되었습니다. 참가자: 강봉권, 김보성, 홍순도 교수, 박지우 교수. 디지털 트윈 캘리브레이션 관련 향후 협력 연구 계획에 대해 심층 논의하였습니다.' },
  { date: '2024.09', type: 'funding', img: '22.png',
    title: 'New Research Project Funded by Korea Research Foundation (\'24.09–\'27.08)',
    titleKo: '한국연구재단 신규 연구과제 수주 (2024.09–2027.08)',
    desc: 'I have commenced a new research project funded by the Korea Research Foundation under the Ministry of Education, with a ₩180 million research grant as the Principal Investigator. The project, titled "AI-integrated Simulation Optimization for Smart Storage/Retrieval Systems", will be conducted from September 2024 to August 2027. This funding will enable us to advance our research in AI-driven simulation optimization to enhance the efficiency of smart storage and retrieval systems.',
    descKo: '교육부 산하 한국연구재단으로부터 연구책임자로서 1억 8천만 원 규모의 연구비를 지원받아 신규 연구과제를 시작하였습니다. 과제명 "AI 통합 시뮬레이션 최적화를 통한 스마트 입출고 시스템 연구"는 2024년 9월부터 2027년 8월까지 수행됩니다. 이 연구비를 통해 스마트 입출고 시스템의 효율성을 향상시키는 AI 기반 시뮬레이션 최적화 연구를 심화할 수 있게 되었습니다.' },
  { date: '2024.08.11–16', type: 'collaboration', img: '21.jpg',
    title: 'The 2nd Joint Workshop on the Recent Digital Twin and Production Logistics Research at the University of Washington',
    titleKo: '워싱턴대학교 제2회 디지털 트윈 및 생산물류 연구 공동 워크숍',
    desc: 'The 2nd Joint Workshop on Recent Digital Twin and Production Logistics Research (DTPL) was held from August 11 to 15, 2024, at the University of Washington. Attendees included Bonggwon Kang, Gwangheon Lee, Prof. Soondo Hong, and Prof. Chiwoo Park. During the workshop, we engaged in in-depth discussions on collaborative research related to digital twin-based decision-making in the warehouse and semiconductor industries. We would like to extend our special gratitude to Prof. Park for his significant efforts and time in organizing and inviting us to this event.',
    descKo: '2024년 8월 11일부터 15일까지 워싱턴 대학교에서 제2회 디지털 트윈 및 생산물류 연구(DTPL) 공동 워크숍이 개최되었습니다. 참가자: 강봉권, 이광헌, 홍순도 교수, 박지우 교수. 창고 및 반도체 산업에서의 디지털 트윈 기반 의사결정 관련 협력 연구에 대한 심층 논의를 진행하였습니다. 행사를 기획하고 초청해 주신 박 교수님께 특별히 감사드립니다.' },
  { date: '2024.05.02–04', type: 'conference', img: '20.jpg',
    title: 'Presentation at the Spring KIIE Conference',
    titleKo: '2024 대한산업공학회 춘계학술대회 발표',
    desc: 'I gave a research presentation at the Spring KIIE Conference in Yeosu, South Korea. I introduced a surrogate-based optimization approach for yard template planning in a transshipment hub. The title is "Gaussian process-based yard template planning under vehicle congestion and container rehandling: a case study of Busan Port Terminal". This research addresses the difficulties when it comes to deal with simulation-based decision-making for a high-dimensional and combinatorial problem.',
    descKo: '여수에서 개최된 대한산업공학회 춘계학술대회에서 환적 허브 야드 템플릿 계획을 위한 서로게이트 기반 최적화 접근법을 발표하였습니다. 발표 제목은 "차량 혼잡 및 컨테이너 재처리 하에서의 가우시안 프로세스 기반 야드 템플릿 계획: 부산항 터미널 사례 연구"입니다.' },
  { date: '2024.02.18–23', type: 'collaboration', img: '19.jpg',
    title: 'UW-PNU Joint Workshop at the University of Washington',
    titleKo: '워싱턴대학교 UW-PNU 공동 워크숍',
    desc: 'I and Professor Hong participated in the joint meeting on the recent digital twin research and simulation education at the University of Washington from February 18th to 23rd. We had a couple of meetings on the research topics such as the digital twin and its industry application. We\'d like to express gratitude to Professor Park for his effort for organizing this workshop.',
    descKo: '2024년 2월 18일부터 23일까지 워싱턴 대학교에서 개최된 디지털 트윈 연구 및 시뮬레이션 교육 관련 공동 회의에 홍 교수님과 참가하였습니다. 디지털 트윈 및 산업 응용 등 다양한 연구 주제에 대한 논의가 이루어졌습니다. 워크숍 개최를 위해 노력해 주신 박 교수님께 감사드립니다.' },
  { date: '2024.01.31', type: 'conference', img: '18.jpg',
    title: 'Presentation at the Smart Manufacturing Forum for the SEMICON KOREA',
    titleKo: '세미콘 코리아 스마트 제조 포럼 초청 발표',
    desc: 'I gave an invited talk at the Smart Manufacturing Forum for the SEMICON KOREA in Seoul, South Korea. I delivered an introduction to simulation-based decision-making in large-scale material handling systems and a case study. It is such a big honor for me to be invited and present my research for this occasion.',
    descKo: '서울에서 개최된 세미콘 코리아 스마트 제조 포럼에서 초청 강연을 하였습니다. 대규모 물류 시스템에서의 시뮬레이션 기반 의사결정 소개와 사례 연구를 발표하였습니다. 이런 귀한 자리에 초청받아 연구를 발표할 수 있어 큰 영광이었습니다.',
    url: 'https://www.semiconkorea.org/ko/node/9166' },
  // ── 2023 ────────────────────────────────────────────────────────────────
  { date: '2023.11.03', type: 'conference', img: '17.jpg',
    title: 'Presentation at the Semiconductor Smart Manufacturing Working Group',
    titleKo: '반도체 스마트 제조 워킹그룹 발표',
    desc: 'I gave a presentation at the "Semiconductor Smart Manufacturing Working Group" during a planning session at the 2023 KIIE conference. The title of my talk was "Simulation-based optimization alternatives for large-scale material handling systems". I would like to express my gratitude to my professors Hong and Kim for their support. Furthermore, I\'d like to extend a special thanks to the audience for their constructive comments and attentive engagement throughout my presentation.',
    descKo: '2023 대한산업공학회 컨퍼런스 기획 세션 "반도체 스마트 제조 워킹그룹"에서 "대규모 물류 시스템을 위한 시뮬레이션 기반 최적화 대안"을 주제로 발표하였습니다. 홍 교수님과 김 교수님의 지원에 감사드리며, 건설적인 의견을 주신 청중 여러분께도 감사드립니다.' },
  { date: '2023.10.18', type: 'conference', img: '16.png',
    title: 'Presentation at the 2023 INFORMS Annual Meeting',
    titleKo: '2023 INFORMS 연례 학술대회 발표',
    desc: 'I gave an invited talk at the 2023 INFORMS Annual Meeting in Phoenix, AZ, USA. The title was "Surrogate model-based simulation optimization of vehicle positioning strategy in a semiconductor fab". I am deeply grateful to Professor Park, Professor Kim, and Professor Hong for their invaluable guidance and insightful feedback that significantly enhanced the quality of this research!',
    descKo: '미국 아리조나주 피닉스에서 개최된 2023 INFORMS 연례 학술대회에서 "반도체 팹에서의 차량 배치 전략에 대한 서로게이트 모델 기반 시뮬레이션 최적화"를 주제로 초청 발표하였습니다. 귀중한 조언과 통찰력 있는 피드백으로 연구 품질을 크게 향상시켜 주신 박 교수님, 김 교수님, 홍 교수님께 깊이 감사드립니다.' },
  { date: '2023.10', type: 'journal', img: '15.png',
    title: 'New paper has been accepted for publication in IEEE Access',
    titleKo: 'IEEE Access 논문 게재 확정',
    desc: '"Simulation optimization of collaborative handshake operations for twin overhead shuttle cranes in a rail-based automated container terminal under demand uncertainty" has been accepted for publication in IEEE Access. Abstract) A handshake operation can mitigate workload imbalance and interference between twin transporters in a material handling system. Terminal operators in a rail-based automated container terminal can employ the handshake operation to twin overhead shuttle cranes (OSs) under maritime demand uncertainty. Since a handshake location is critical to collaboration performance, terminal operators often rely on simulation experiments with a manual iterative design to determine optimal handshake locations. However, the simulation optimization is still challenging when a simulation execution is computationally expensive. This study proposes a Bayesian optimization-based approach to expedite the decision-making process.',
    descKo: '"수요 불확실성 하에서 레일 기반 자동 컨테이너 터미널의 트윈 오버헤드 셔틀 크레인을 위한 협력적 핸드쉐이크 작업의 시뮬레이션 최적화"가 IEEE Access에 게재 확정되었습니다. 초록) 핸드쉐이크 작업은 물류 시스템에서 트윈 운송 장치 간의 작업부하 불균형과 간섭을 완화할 수 있습니다. 핸드쉐이크 위치가 협력 성능에 중요하므로, 본 연구는 베이지안 최적화 기반 접근법을 제안하여 제한된 시뮬레이션 실행 내에서 의사결정 과정을 가속화합니다.',
    url: 'https://ieeexplore.ieee.org/document/10285297' },
  { date: '2023.09', type: 'journal', img: '14.png',
    title: 'New paper has been accepted for publication in IEEE Transactions on Automation Science and Engineering',
    titleKo: 'IEEE Transactions on Automation Science and Engineering 논문 게재 확정',
    desc: '"Bayesian optimization for the vehicle dwelling policy in a semiconductor wafer fab" has been accepted for publication in IEEE Transactions on Automation Science and Engineering. I have truly learned a lot from Professor Hong, Professor Park, and Professor Kim throughout the collaboration. Abstract) Many fabs prefer simulation-based decision making for vehicle dwelling policies because it can capture a fab\'s scalability and complexity. Vehicle dwelling policies assign idle vehicles to intra-bay and outer loops in automated material handling systems (AMHSs) to respond quickly to transportation demands. We propose a simulation optimization approach based on Bayesian optimization (BO) with class-based clustering. BO adaptively traces efficient vehicle dwelling policies based on a surrogate model and an acquisition function. Class-based clustering alleviates the high dimensionality of the design space by grouping bays into a small number of classes.',
    descKo: '"반도체 웨이퍼 팹에서 차량 대기 정책을 위한 베이지안 최적화"가 IEEE Transactions on Automation Science and Engineering에 게재 확정되었습니다. 초록) 많은 팹에서 시뮬레이션 기반 의사결정을 선호합니다. 차량 대기 정책은 운반 수요에 신속하게 대응하기 위해 유휴 차량을 베이 내 및 외부 루프에 배정합니다. 본 연구는 클래스 기반 클러스터링을 적용한 베이지안 최적화(BO) 기반 시뮬레이션 최적화 접근법을 제안합니다. BO는 서로게이트 모델과 획득 함수를 기반으로 효율적인 차량 대기 정책을 적응적으로 추적하며, 클래스 기반 클러스터링은 베이들을 소수의 클래스로 그룹화하여 설계 공간의 고차원성을 완화합니다.',
    url: 'https://ieeexplore.ieee.org/document/10278155' },
  { date: '2023.09', type: 'journal', img: '13.png',
    title: 'New paper has been accepted for publication in Journal of the Korea Society for Simulation',
    titleKo: '한국시뮬레이션학회지 논문 게재 확정',
    desc: '"A Simulation-based Optimization for Scheduling in a Fab: Comparative Study on Different Sampling Methods" has been accepted in Journal of the Korea Society for Simulation. Abstract) A semiconductor fabrication facility (FAB) is one of the most capital-intensive and large-scale manufacturing systems that operate under complex and uncertain constraints through hundreds of fabrication steps. To improve fab performance with intuitive scheduling, practitioners have used weighted-sum scheduling. In this study, we investigated three sampling methods (i.e., Optimal Latin hypercube sampling (OLHS), Genetic algorithm (GA), and Decision-based sequential search (DSS)) for the optimization. Our simulation experiments demonstrate that: (1) three methods outperform greedy heuristics in performance metrics; (2) GA and DSS can be promising tools to accelerate the decision-making process.',
    descKo: '"반도체 팹 스케줄링을 위한 시뮬레이션 기반 최적화: 샘플링 방법 비교 연구"가 한국시뮬레이션학회지에 게재 확정되었습니다. 초록) 반도체 팹은 수백 단계의 복잡하고 불확실한 제약 조건을 거쳐 운영되는 가장 자본집약적인 대규모 제조 시스템 중 하나입니다. 본 연구에서는 가중합 스케줄링 최적화를 위한 세 가지 샘플링 방법(최적 라틴 하이퍼큐브 샘플링, 유전 알고리즘, 의사결정 기반 순차 탐색)을 조사하고, 이 방법들이 탐욕적 휴리스틱보다 우수함을 확인하였습니다.' },
  { date: '2023.09.07', type: 'conference', img: '12.jpg',
    title: 'Presentation at the 11th International Conference on Logistics and Maritime Systems',
    titleKo: '제11회 물류해운시스템 국제학술대회 발표',
    desc: 'I had a presentation at the 11th International Conference on Logistics and Maritime Systems, September 04–07, 2023, Busan, Korea. The title was "A case study of data-driven yard template planning with feature engineering". Abstract) Yard template planning in a container terminal aims to obtain the optimal assignment of yard storage for upcoming vessels with the minimum vessel turnaround time. We present data-driven yard template planning with feature engineering. Our simulation results revealed that: (1) the presented approach can outperform an analytical model under vehicle congestion; and (2) feature engineering significantly affects the optimization performance.',
    descKo: '2023년 9월 4일부터 7일까지 부산에서 개최된 제11회 물류해운시스템 국제학술대회에서 "특징 공학을 활용한 데이터 기반 야드 템플릿 계획 사례 연구"를 발표하였습니다. 초록) 컨테이너 터미널에서의 야드 템플릿 계획은 최소 선박 재항 시간을 목표로 예정된 선박의 야드 저장소를 최적으로 배정하는 것을 목표로 합니다. 특징 공학을 활용한 데이터 기반 야드 템플릿 계획을 제안하고 시뮬레이션 결과를 통해 분석적 모델 대비 우수성을 확인하였습니다.' },
  { date: '2023.06.25', type: 'journal', img: '11.png',
    title: 'Active Learning of Piecewise Gaussian Process Surrogates — Preprint Available',
    titleKo: '점진적 가우시안 프로세스 서로게이트 능동 학습 - 프리프린트 공개',
    desc: 'I participated in an international joint research and the preprint of our manuscript is now available. The research title is "Active Learning of Piecewise Gaussian Process Surrogates". It is such a big honor for me to join the collaborative research with Chiwoo Park, Robert Waelder, Benji Maruyama, Soondo Hong, and Robert Gramacy. Abstract) Active learning of Gaussian process (GP) surrogates has been useful for optimizing experimental designs for physical/computer simulation experiments. In this paper, we develop a method for active learning of piecewise, Jump GP surrogates. Jump GPs are continuous within, but discontinuous across, regions of a design space, as required for applications spanning autonomous materials design, configuration of smart factory systems, and many others. We demonstrate that additionally accounting for model bias is essential in the Jump GP context.',
    descKo: '국제 공동 연구에 참여하여 프리프린트가 공개되었습니다. 연구 제목: "점진적 가우시안 프로세스 서로게이트의 능동 학습". Chiwoo Park, Robert Waelder, Benji Maruyama, 홍순도, Robert Gramacy와의 협력 연구에 참여하게 되어 큰 영광입니다. 초록) 본 논문에서는 점진적 Jump GP 서로게이트의 능동 학습 방법을 개발합니다. Jump GP는 설계 공간 내 영역 안에서는 연속적이지만 영역 간에는 불연속적이며, 모델 편향을 추가로 고려하는 것이 Jump GP 맥락에서 필수적임을 보입니다.' },
  { date: '2023.06.16', type: 'collaboration', img: '10.jpg',
    title: 'Surrogate model-based simulation optimization international joint research workshop',
    titleKo: '서로게이트 기반 시뮬레이션 최적화 국제 공동 연구 워크숍',
    desc: 'Surrogate model-based simulation optimization international joint research workshop was held on June 16, 2023. Bonggwon Kang and Professor Soondo Hong attended the workshop. The invited participant included Professor Chiwoo Park from Florida State University. We discussed two ongoing studies and the direction of future studies for further improvements. I\'d like to express gratitude to professors for giving lots of effort in advising my research.',
    descKo: '2023년 6월 16일 서로게이트 기반 시뮬레이션 최적화 국제 공동 연구 워크숍이 개최되었습니다. 강봉권과 홍순도 교수가 참가하였으며, 플로리다 주립대학교 박지우 교수가 초청 참가하였습니다. 진행 중인 두 개의 연구와 향후 연구 방향에 대해 논의하였습니다.' },
  { date: '2023.01.27', type: 'conference', img: '9.jpg',
    title: 'Presentation at Grand PNU Performance Exchange Programme',
    titleKo: 'Grand PNU 성과발표회 발표',
    desc: 'I had a presentation at PNU Grand Performance Exchange Programme. My topic was "Simulation-based decision making in large-scale simulations". Since many manufacturing and material handling systems have enlarged the scales of factories and warehouses to achieve economies of scale, simulation has been widely used as a promising tool to diagnose and predict their decision making for upcoming demands. In this presentation, I shared my recent research progress and got comments from other graduate students.',
    descKo: 'PNU Grand 성과발표회에서 "대규모 시뮬레이션에서의 시뮬레이션 기반 의사결정"을 주제로 발표하였습니다. 많은 제조 및 물류 시스템이 규모의 경제를 실현하기 위해 공장과 창고의 규모를 확대함에 따라, 시뮬레이션은 예정된 수요에 대한 의사결정을 진단하고 예측하는 유망한 도구로 널리 활용됩니다. 이 발표에서 최근 연구 진행 상황을 공유하고 다른 대학원생들로부터 의견을 받았습니다.' },
  // ── 2022 ────────────────────────────────────────────────────────────────
  { date: '2022.10', type: 'conference', img: '8.png',
    title: 'Presentation at Winter Simulation Conference',
    titleKo: '동계 시뮬레이션 컨퍼런스(WSC) 2022 발표',
    desc: 'Winter Simulation Conference is one of the biggest conferences in Simulation. I had a presentation titled "Yard Template Planning in a Transshipment Hub: Gaussian Process Regression" for WSC 2022. The authors are Bonggwon Kang, Permata Vallentino Eko Joatiko, Jungtae Park, and Soondo Hong. Abstract) In this study, we propose an application of a Gaussian Process (GP) to predict the vessel turnaround time under the impacts of vehicle interruption and blocking. Based on the predictions, we determine the yard template with the shortest predicted vessel turnaround time among candidate yard templates. The simulation results show that the application reduces the vessel turnaround time by 6.66% compared with the baseline model.',
    descKo: '동계 시뮬레이션 컨퍼런스는 시뮬레이션 분야 최대 학술대회 중 하나입니다. WSC 2022에서 "환적 허브 야드 템플릿 계획: 가우시안 프로세스 회귀"를 발표하였습니다. 저자: 강봉권, Permata Vallentino Eko Joatiko, 박정태, 홍순도. 초록) 본 연구에서는 차량 간섭 및 차단의 영향 하에서 선박 재항 시간을 예측하기 위한 가우시안 프로세스(GP) 응용을 제안합니다. 시뮬레이션 결과, 기준 모델 대비 선박 재항 시간을 6.66% 단축하였습니다.',
    url: 'https://ieeexplore.ieee.org/abstract/document/10015251' },
  { date: '2022.10', type: 'journal', img: '7.png',
    title: 'Paper publication in Journal of Korean Institute of Industrial Engineers',
    titleKo: '대한산업공학회지 논문 게재',
    desc: '"A GA-based Optimization of a Weighted Lot Targeting Rule in a Semiconductor Wafer Fab" was published in Journal of the Korean Institute of Industrial Engineers. Abstract) Production scheduling in a semiconductor wafer fabrication (FAB) can be decomposed into two phases: lot targeting and lot dispatching. A weighted dispatching rule is a widely applied concept to obtain the production schedule in the FAB under its complex manufacturing factors. In this study, we investigate a weighted lot targeting rule considering the time-variant manufacturing factors, i.e., processing times, set-up operations, work-in-process levels, and transportation times for the bottleneck (photolithography) process. We propose a Genetic Algorithm (GA) to determine the efficient weights within a limited simulation run.',
    descKo: '"반도체 웨이퍼 팹에서 가중 로트 타게팅 규칙의 유전 알고리즘 기반 최적화"가 대한산업공학회지에 게재되었습니다. 초록) 반도체 팹의 생산 스케줄링은 로트 타게팅과 로트 디스패칭의 두 단계로 분해될 수 있습니다. 본 연구에서는 처리 시간, 셋업 작업, 재공품 수준, 운송 시간 등 시변 제조 요인을 고려한 가중 로트 타게팅 규칙을 조사하고, 제한된 시뮬레이션 실행 내에서 효율적인 가중치를 결정하기 위한 유전 알고리즘(GA)을 제안합니다.',
    url: 'https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002887365' },
  { date: '2022.09', type: 'book', img: '6.png',
    title: 'Book chapter publication in Smart Manufacturing and Logistics Systems: Turning Ideas into Action',
    titleKo: '스마트 제조 및 물류 시스템 도서 챕터 게재',
    desc: '"Sequential optimization of a temporary storage location for cooperative twin overhead shuttles in a rail-based automated container terminal" was published in Smart Manufacturing and Logistics Systems: Turning Ideas into Action. Abstract) Twin overhead shuttle cranes (OSs) transport containers in a rail-based automated container terminal (RACT). Terminal operators separate a job into a main job and an auxiliary job based on a temporary storage location. This study proposes a sequential optimization approach, Bayesian optimization (BO), to determine the optimal temporary storage location within a limited simulation run. An experiment demonstrates that the BO predicts the outcomes of a RACT simulation and ensures a near-optimal solution within a limited simulation run.',
    descKo: '"레일 기반 자동 컨테이너 터미널에서 협력적 트윈 오버헤드 셔틀의 임시 저장 위치 순차 최적화"가 Smart Manufacturing and Logistics Systems에 게재되었습니다. 초록) 트윈 오버헤드 셔틀 크레인(OS)은 레일 기반 자동 컨테이너 터미널(RACT)에서 컨테이너를 운반합니다. 본 연구는 베이지안 최적화(BO)를 사용하여 제한된 시뮬레이션 실행 내에서 최적 임시 저장 위치를 결정하는 순차 최적화 접근법을 제안합니다.',
    url: 'https://link.springer.com/chapter/10.1007/978-3-031-16407-1_34' },
  { date: '2022.09', type: 'journal', img: '5.png',
    title: 'Paper publication in Journal of Korean Society of Industrial and Systems Engineering',
    titleKo: '한국산업시스템학회지 논문 게재',
    desc: '"A Dynamic OHT Routing Algorithm in Automated Material Handling Systems" was published in Journal of Korean Society of Industrial and Systems Engineering. Abstract) An automated material handling system (AMHS) has been emerging as an important factor in the semiconductor wafer manufacturing industry. Unexpected vehicle congestion increases the delivery time and deteriorates the Fab\'s production efficiency. In this study, we propose a Q-Learning based dynamic routing algorithm considering vehicle congestion to reduce the delivery time. Through simulation experiments, we confirm that the proposed algorithm finds an efficient path for the vehicles compared to benchmark algorithms with a reduced mean and decreased standard deviation of the delivery time in the Fab\'s AMHS.',
    descKo: '"자동화 물류 시스템에서 동적 OHT 경로 계획 알고리즘"이 한국산업시스템학회지에 게재되었습니다. 초록) 자동화 물류 시스템(AMHS)은 반도체 웨이퍼 제조 산업에서 중요한 요소로 부상하고 있습니다. 예상치 못한 차량 혼잡은 배송 시간을 증가시키고 팹의 생산 효율을 저하시킵니다. 본 연구에서는 배송 시간을 줄이기 위해 차량 혼잡을 고려한 Q-러닝 기반 동적 경로 계획 알고리즘을 제안합니다.',
    url: 'https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002881508' },
  { date: '2022.06', type: 'journal', img: '4.png',
    title: 'Paper publication in Korea Journal of BigData',
    titleKo: '한국빅데이터학회지 논문 게재',
    desc: '"A Study of a Video-based Simulation Input Modeling Procedure in a Construction Equipment Assembly Line" was published in Korea Journal of BigData. Abstract) A simulation technique can be used to analyze performance measures and support decision makings in manufacturing systems considering operational uncertainty and complexity. However, data collection to build a simulation is quite limited when a target system includes manual productions with a lot of operational time such as construction equipment assembly lines. This study proposes a procedure for simulation input modeling using video data when it is difficult to collect enough input data to fit a probability distribution.',
    descKo: '"건설 장비 조립 라인에서 비디오 기반 시뮬레이션 입력 모델링 절차 연구"가 한국빅데이터학회지에 게재되었습니다. 초록) 시뮬레이션 기법은 운영 불확실성과 복잡성을 고려하여 제조 시스템의 성능 지표를 분석하고 의사결정을 지원하는 데 사용될 수 있습니다. 본 연구는 건설 장비 조립 라인처럼 충분한 입력 데이터 수집이 어려운 경우 비디오 데이터를 활용한 시뮬레이션 입력 모델링 절차를 제안합니다.',
    url: 'https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002855671' },
  { date: '2022.06', type: 'journal', img: '3.png',
    title: 'Paper publication in Korea Journal of BigData',
    titleKo: '한국빅데이터학회지 논문 게재',
    desc: '"A Simulation-based Genetic Algorithm for a Dispatching Rule in a Flexible Flow Shop with Rework Process" was published in Korea Journal of BigData. Abstract) This study investigates a dynamic flexible flow shop scheduling problem under uncertain rework operations for an automobile pipe production line. We propose a weighted dispatching rule (WDR) based on the multiple dispatching rules to minimize the weighted sum of average flowtime and tardiness. The simulation experiments demonstrate that WDR outperforms the baseline dispatching rules in average flowtime and tardiness.',
    descKo: '"재작업 공정이 있는 유연 흐름 공정에서 디스패칭 규칙을 위한 시뮬레이션 기반 유전 알고리즘"이 한국빅데이터학회지에 게재되었습니다. 초록) 본 연구는 자동차 파이프 생산 라인의 불확실한 재작업 작업 하에서의 동적 유연 흐름 공정 스케줄링 문제를 다룹니다. 평균 흐름 시간과 납기 지연의 가중합을 최소화하기 위한 가중 디스패칭 규칙(WDR)을 제안합니다.',
    url: 'https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002855661' },
  // ── 2021 / 2020 ──────────────────────────────────────────────────────────
  { date: '2021.08', type: 'journal', img: '2.png',
    title: 'A paper publication in IEEE Access',
    titleKo: 'IEEE Access 논문 게재',
    desc: '"A Job Sequencing Problem of an Overhead Shuttle Crane in a Rail-Based Automated Container Terminal" was published in IEEE Access. I\'m one of the co-first authors. I suggested a two-phase genetic algorithm and conducted simulation experiments with polishing the manuscript. Abstract) This study proposes a job scheduling model and its heuristics for an automated container terminal with an overhead shuttle crane (OS) to reduce the total tardiness time of flatcars and external trucks by considering the separation of each job into a main job, and a premarshaling or remarshaling job. We present a two-stage genetic algorithm (TGA) based on two local improvement procedures: an iterative local search procedure and an opportunistic job separation procedure.',
    descKo: '"레일 기반 자동 컨테이너 터미널에서 오버헤드 셔틀 크레인의 작업 시퀀싱 문제"가 IEEE Access에 게재되었습니다. 공동 제1저자로 참여하였습니다. 초록) 본 연구는 오버헤드 셔틀 크레인(OS)이 있는 자동 컨테이너 터미널에서 플랫카 및 외부 트럭의 총 납기 지연 시간을 줄이기 위한 작업 스케줄링 모델과 휴리스틱을 제안합니다. 반복 지역 탐색과 기회적 작업 분리 절차를 기반으로 한 2단계 유전 알고리즘(TGA)을 제안합니다.',
    url: 'https://ieeexplore.ieee.org/abstract/document/9174991' },
  { date: '2020.04', type: 'book', img: '1.png',
    title: 'Book chapter publication in Dynamics in Logistics',
    titleKo: 'Dynamics in Logistics 도서 챕터 게재',
    desc: '"A Simulation Study of a Storage Policy for a Container Terminal" was published in Dynamics in Logistics. Abstract) This paper proposes a storage policy for container terminals that handle large numbers of vessels and containers. The storage policy considers the estimated workload at a certain area in a given period; the partition of a storage block into subblocks; the proximities between containers belonging to the same group; the segregation between different groups of containers; and the stack heights of containers. The preliminary result shows that the container terminal operates more efficiently under the storage policy with a bay as a subblock setting.',
    descKo: '"컨테이너 터미널 저장 정책에 관한 시뮬레이션 연구"가 Dynamics in Logistics에 게재되었습니다. 초록) 본 논문은 다수의 선박과 컨테이너를 처리하는 컨테이너 터미널을 위한 저장 정책을 제안합니다. 저장 정책은 특정 기간 내 예상 작업부하, 저장 블록의 서브블록 분할, 동일 그룹 컨테이너 간 근접성, 다른 그룹 컨테이너 간 분리, 컨테이너 스택 높이를 고려합니다.',
    url: 'https://link.springer.com/chapter/10.1007/978-3-030-44783-0_6' },
]

const typeStyle = {
  journal:       { dot: 'bg-indigo-500',  badge: 'bg-indigo-950/60 text-indigo-400 border border-indigo-800/50'  },
  conference:    { dot: 'bg-teal-500',    badge: 'bg-teal-950/60 text-teal-400 border border-teal-800/50'        },
  book:          { dot: 'bg-amber-500',   badge: 'bg-amber-950/60 text-amber-400 border border-amber-800/50'     },
  patent:        { dot: 'bg-violet-500',  badge: 'bg-violet-950/60 text-violet-400 border border-violet-800/50'  },
  funding:       { dot: 'bg-green-500',   badge: 'bg-green-950/60 text-green-400 border border-green-800/50'     },
  collaboration: { dot: 'bg-rose-400',    badge: 'bg-rose-950/60 text-rose-400 border border-rose-800/50'        },
}

const typeLabelKo = {
  journal: '저널', conference: '학회', book: '도서', patent: '특허', funding: '연구비', collaboration: '협력',
}

function groupByYear(list) {
  const acc = list.reduce((g, p) => {
    const y = p.date.slice(0, 4)
    if (!g[y]) g[y] = []
    g[y].push(p)
    return g
  }, {})
  return { grouped: acc, years: Object.keys(acc).sort((a, b) => b - a) }
}

function PhotoPlaceholder() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
      <svg className="w-10 h-10 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <span className="text-xs text-gray-700 font-medium tracking-wide">Photo coming soon</span>
    </div>
  )
}

function renderDesc(desc, ko) {
  if (!desc) return null
  const marker = ko ? '초록)' : 'Abstract)'
  const idx = desc.indexOf(marker)
  if (idx === -1) {
    return <p className="text-sm text-gray-300 leading-relaxed">{desc}</p>
  }
  const before = desc.slice(0, idx).trim()
  const after = desc.slice(idx + marker.length).trim()
  return (
    <>
      {before && <p className="text-sm text-gray-300 leading-relaxed">{before}</p>}
      <div className="mt-4 pt-4 border-t border-white/10">
        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
          {ko ? '초록' : 'Abstract'}
        </span>
        <p className="text-sm text-gray-300 leading-relaxed mt-2">{after}</p>
      </div>
    </>
  )
}

function NewsModal({ item, onClose }) {
  const { lang } = useLang()
  const ko = lang === 'ko'
  const [imgFailed, setImgFailed] = useState(false)
  const s = typeStyle[item.type] || typeStyle.journal
  const showImg = item.img && !imgFailed

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {showImg && (
          <div className="bg-gray-800 overflow-hidden rounded-t-2xl flex items-center justify-center">
            <img
              src={`${base}images/${item.img}`}
              alt={ko ? item.titleKo : item.title}
              className="max-w-full max-h-[55vh] object-contain"
              onError={() => setImgFailed(true)}
            />
          </div>
        )}
        {!showImg && item.img && (
          <div className="aspect-video bg-gray-800/80 rounded-t-2xl">
            <PhotoPlaceholder />
          </div>
        )}

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${s.badge}`}>
                {ko ? (typeLabelKo[item.type] || item.type) : item.type}
              </span>
              <span className="text-sm text-gray-500">{item.date}</span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-white bg-white/5 hover:bg-white/15 rounded-full p-1.5 transition-colors flex-shrink-0 ml-4"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <h2 className="font-bold text-white text-base leading-snug mb-4">
            {ko ? item.titleKo : item.title}
          </h2>

          {renderDesc(ko ? item.descKo : item.desc, ko)}

          {item.url && (
            <div className="mt-5">
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white text-sm font-semibold transition-colors"
              >
                {ko ? '링크 방문' : 'Visit Link'}
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function NewsCard({ item, onCardClick }) {
  const { lang } = useLang()
  const ko = lang === 'ko'
  const [imgFailed, setImgFailed] = useState(false)
  const s = typeStyle[item.type] || typeStyle.journal
  const showImg = item.img && !imgFailed

  return (
    <motion.div variants={fadeUp}
      className="bg-gray-800/50 rounded-2xl border border-white/10 hover:border-indigo-500/30 hover:bg-gray-800/80 transition-all duration-200 overflow-hidden flex flex-col cursor-pointer group"
      onClick={() => onCardClick(item)}
    >
      <div className="aspect-video bg-gray-900/80 flex-shrink-0 overflow-hidden">
        {showImg ? (
          <img
            src={`${base}images/${item.img}`}
            alt={ko ? item.titleKo : item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <PhotoPlaceholder />
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-2.5">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${s.badge}`}>
            {ko ? (typeLabelKo[item.type] || item.type) : item.type}
          </span>
          <span className="text-xs text-gray-500">{item.date}</span>
        </div>

        <p className="font-semibold text-gray-100 text-sm leading-snug flex-1">
          {ko ? item.titleKo : item.title}
        </p>

        <p className="text-xs text-gray-600 mt-3">{ko ? '자세히 보기 →' : 'Click to read more →'}</p>
      </div>
    </motion.div>
  )
}

function PageHeader() {
  const { lang } = useLang()
  return (
    <section className="pt-32 pb-20 bg-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.h1 variants={fadeUp}
            className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[1.05] mb-5">
            {lang === 'ko' ? '뉴스' : 'News'}
          </motion.h1>
        </motion.div>
      </div>
    </section>
  )
}

export default function NewsPage() {
  const { lang } = useLang()
  const ko = lang === 'ko'
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedItem, setSelectedItem] = useState(null)
  const filtered = activeFilter === 'all' ? items : items.filter(p => p.type === activeFilter)
  const { grouped, years } = groupByYear(filtered)

  return (
    <>
      {selectedItem && (
        <NewsModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
      <PageHeader />

      <section className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Filter bar */}
          <div className="flex flex-wrap gap-2 mb-14">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                activeFilter === 'all'
                  ? 'bg-white/15 text-white border-white/30'
                  : 'text-gray-400 border-white/10 hover:text-gray-200 hover:border-white/20'
              }`}
            >
              {ko ? '전체' : 'All'}
            </button>
            {Object.entries(typeStyle).map(([k, v]) => (
              <button
                key={k}
                onClick={() => setActiveFilter(k)}
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors capitalize ${
                  activeFilter === k ? v.badge : 'text-gray-400 border-white/10 hover:text-gray-200 hover:border-white/20'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${v.dot}`} />
                {ko ? (typeLabelKo[k] || k) : k}
              </button>
            ))}
          </div>

          {/* Year sections with card grids */}
          <div key={activeFilter} className="space-y-16">
            {years.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-12">
                {ko ? '해당 항목이 없습니다.' : 'No items for this filter.'}
              </p>
            )}
            {years.map(year => (
              <motion.div key={year}
                initial="hidden" animate="visible"
                variants={stagger}
              >
                <motion.div variants={fadeUp} className="flex items-center gap-4 mb-8">
                  <span className="text-3xl font-black text-white">{year}</span>
                  <span className="flex-1 h-px bg-white/10" />
                  <span className="text-sm text-gray-500">
                    {grouped[year].length}{ko ? '개' : ` item${grouped[year].length > 1 ? 's' : ''}`}
                  </span>
                </motion.div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {grouped[year].map((p, i) => (
                    <NewsCard key={i} item={p} onCardClick={setSelectedItem} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
