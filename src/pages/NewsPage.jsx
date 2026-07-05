import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }

const base = import.meta.env.BASE_URL

// Photos go in public/images/
// Numbered from oldest (1.jpg) to newest (38.jpg) — bottom of list = 1.jpg
const items = [
  // ── 2026 ────────────────────────────────────────────────────────────────
  { date: '2026', type: 'journal', img: '38.png',
    title: 'New paper accepted in International Journal of Production Research',
    desc: '"Uncertainty-aware simulation optimization for yard template planning in transshipment hubs", authors: Kang, Bonggwon; Lee, Taehoon; Sun, Zhuo; Hong, Soondo. Abstract) Yard template planning (YTP) is commonly applied at transshipment hubs to reduce transportation costs by assigning storage areas for outbound vessels. With recent advances in digital transformation technologies, terminal operators increasingly rely on simulation-based decision-making to address the uncertain nature of port operations. However, high-fidelity container terminal simulations typically require several minutes to hours per run, and YTP involves a high-dimensional and combinatorial design space. To address these challenges, we propose a domain-informed parallel Bayesian optimisation framework. A Gaussian process (GP) surrogate is presented to efficiently approximate the posterior distribution of terminal performance, thereby enhancing an uncertainty-aware balance between exploration and exploitation. We further integrate a large neighbourhood search (LNS) with the surrogate to navigate the combinatorial design space in parallel. Experimental results show that the proposed approach improves average prediction accuracy by 14.89% and 23.42% over two standard GP surrogates and reduces average vehicle travel time by 4.15%, 1.47%, and 3.27% compared with two Bayesian optimisation approaches and the LNS-based simulation optimisation approach, respectively.',
  },
  { date: '2026.06', type: 'conference', img: '37.jpg',
    title: '2026 KIIE Spring Conference',
    desc: 'Attended the 2026 Spring Conference of the Korean Institute of Industrial Engineers (KIIE), Seoul, Korea.' },
  { date: '2026.05', type: 'conference', img: '36.jpg',
    title: 'Invited Talk at the Korean Reliability Society (KORAS) Emerging Researcher Session',
    desc: 'Invited presentation at the Korean Reliability Society (KORAS) emerging researcher session on simulation-based calibration for automated material handling systems.' },
  { date: '2026.05', type: 'conference', img: '35.jpeg',
    title: '2026 KSIE Conference',
    desc: 'Attended the 2026 Conference of the Korean Society for Industrial and Systems Engineering (KSIE), Korea.' },
  // ── 2025 ────────────────────────────────────────────────────────────────
  { date: '2025.09', type: 'journal', img: '34.png',
    title: 'New paper has been accepted for publication in Technometrics',
    desc: '"Active Learning of Piecewise Gaussian Process Surrogates" has been accepted for publication in Technometrics. Abstract) Active learning of Gaussian process (GP) surrogates has been useful for optimizing experimental designs for physical/computer simulation experiments, and for steering data acquisition schemes in machine learning. In this paper, we develop a method for active learning of piecewise, Jump GP surrogates. Jump GPs are continuous within, but discontinuous across, regions of a design space, as required for applications spanning autonomous materials design, configuration of smart factory systems, and many others. Although our active learning heuristics are appropriated from strategies originally designed for ordinary GPs, we demonstrate that additionally accounting for model bias, as opposed to the usual model uncertainty, is essential in the Jump GP context. Toward that end, we develop an estimator for bias and variance of Jump GP models. Illustrations, and evidence of the advantage of our proposed methods, are provided on a suite of synthetic benchmarks, and real-simulation experiments of varying complexity.',
    url: 'https://www.tandfonline.com/doi/full/10.1080/00401706.2025.2561746' },
  { date: '2025.09', type: 'book', img: '33.jpg',
    title: 'New Book Publication Announcement',
    desc: 'We are pleased to announce the publication of a new book authored by Professor Bonggwon Kang, now available through Kyobo Book Centre. Title: Production Logistics System: Simulation Modeling. Author: Bonggwon Kang. Publisher: Kyobo Book Centre. This book provides a comprehensive introduction to discrete-event simulation modeling with a particular focus on production and logistics systems. Grounded in practical experiences from semiconductor and display industries, it offers both key concepts and techniques for digital twin applications. The book is intended as a practical resource for researchers, undergraduate students, and industry practitioners who wish to build simulation models, analyze system performance, and apply simulation-based insights to manufacturing and logistics environments.',
    url: 'https://ebook-product.kyobobook.co.kr/dig/epd/ebook/E000011944783' },
  { date: '2025.06', type: 'conference', img: '32.jpg',
    title: 'Presentation at the 2025 Spring KIIE Conference',
    desc: 'I delivered a presentation at the Spring KIIE Conference in Seoul, South Korea, titled "Bias-aware simulation calibration for an automated material handling system in a semiconductor fab".' },
  { date: '2025.04', type: 'journal', img: '31.png',
    title: 'New paper has been accepted for publication in Journal of Manufacturing Systems',
    desc: '"A digital twin calibration for an automated material handling system in a semiconductor fab" has been accepted for publication in Journal of Manufacturing Systems, a well-regarded journal in the Operations Research and Management Science field. Abstract) To address the complex, dynamic, and stochastic nature of an automated material handling system (AMHS) in a semiconductor fabrication facility (fab), practitioners have used a high-fidelity discrete-event simulation as its digital twin model for decision-making over several decades. Previous studies have focused on fast digital twin-based decision-making in AMHSs under the assumption that their digital twin models are credible enough to prescribe decisions. However, parameter uncertainty and intrinsic model bias in an AMHS digital twin model can lead to an inaccurate representation of its field system. To address the challenge, this paper introduces the Bayesian calibration, which modularly estimates a digital twin outcome and its discrepancy using Gaussian process priors.',
    url: 'https://www.sciencedirect.com/science/article/pii/S0278612525001049' },
  { date: '2025.03', type: 'journal', img: '30.png',
    title: 'Paper publication in the Journal of the Korea Society for Simulation',
    desc: '"A Comparative Study of Surrogate Models for Simulation-based Yard Template Planning in a Container Terminal" was published in the Journal of the Korea Society for Simulation. Abstract) Yard template planning is the decision-making process of allocating sub-blocks to specific groups of containers based on consignment strategies. Simulation-based decision-making has been used to evaluate and optimize yard template plans for upcoming maritime demand. However, the increased complexity and scale of port operations require a high-fidelity simulation model which takes substantial time for a computational evaluation of a yard template candidate. To address the difficulty, this study proposes a surrogate-based decision-making procedure to replace an expensive-to-evaluate simulation with a prediction model. We also introduce four commonly used surrogate models, Artificial Neural Networks, Random Forest, Gaussian Process, and Support Vector Regression, and compare their performances across various terminal operating scenarios.' },
  { date: '2025.02', type: 'patent', img: '29.png',
    title: 'Patent Registration Update',
    desc: 'We are pleased to announce that our patent titled "Method and Apparatus for Deriving Management Policy of Vehicles" has been officially registered in March 2025. Patent Holders: S. Hong, B. Kang. Patent Type: Korean Patent. Funding Source: Research and Business Development Foundation, Pusan National University. This patent introduces an innovative method and system for optimizing vehicle management policies, enhancing efficiency and decision-making in transportation systems.' },
  { date: '2025.01.31–02.06', type: 'collaboration', img: '28.jpg',
    title: 'The 4th Joint Workshop on the Recent Digital Twin and Production Logistics Research at the University of Washington',
    desc: 'I participated in the joint meeting on the recent digital twin research and simulation education at the University of Washington from January 31st to February 6th. A couple of meetings on the research topics regarding digital twin constructions were conducted.' },
  // ── 2024 ────────────────────────────────────────────────────────────────
  { date: '2024.12', type: 'journal', img: '27.png',
    title: 'Paper publication in the Journal of the Korean Society of Supply Chain Management',
    desc: '"A Simulation Study of the Vehicle Repositioning Policy with the Minimum and Maximum Service Levels in a Demand Responsive Transit System" was published in the Journal of the Korean Society of Supply Chain Management. Abstract) Public transportation faces challenges due to the depopulation in rural areas and the increase in unprofitable routes caused by population polarization. Demand responsive transit has emerged to provide flexible public transit services tailored to various demand patterns. In this study, we present the vehicle repositioning policy based on the minimum and maximum service levels. The proposed policy is to adjust the service levels of each station for a prompt reaction to transit requests. To consider system complexity and dynamics, we develop a discrete-event simulation model and comparatively investigate the impact of the vehicle repositioning policy on operational performance.' },
  { date: '2024.12.11', type: 'conference', img: '26.jpg',
    title: 'Presentation at Hanwha Ocean',
    desc: 'I gave a talk at Hanwha Ocean in Geoje, titled "Recent Research on Digital Twin Construction: A Perspective of Management Science". We had discussions about current operational issues in the Shipbuilding Industry with field practitioners and a research direction to provide reliable production schedules considering numerous combinatorial constraints.' },
  { date: '2024.10.26', type: 'conference', img: '25.png',
    title: 'Presentation at the 2024 Fall KIIE Conference',
    desc: 'I delivered a presentation at the Fall KIIE Conference in Seoul, South Korea, titled "Discrete-event Simulation Calibration for a Large-scale Material Handling System: A Case Study of a Semiconductor Fab". This research highlights the use of Bayesian calibration for digital twin construction in an automated material handling system within a semiconductor fab. I sincerely thank Professor Park, Professor Kim, and Professor Hong for their valuable feedback on this research!' },
  { date: '2024.10.21', type: 'conference', img: '24.jpg',
    title: 'Presentation at the 2024 INFORMS Annual Meeting',
    desc: 'I gave an invited talk at the 2024 INFORMS Annual Meeting in Seattle, titled "Modular Calibration of a Digital Twin Model for Planning-Level Decision-Making in a Semiconductor Fab\'s AMHS." I appreciate Professor Park\'s support for this opportunity.' },
  { date: '2024.10.20', type: 'collaboration', img: '23.jpg',
    title: 'The 3rd Joint Workshop on the Recent Digital Twin and Production Logistics Research at the University of Washington',
    desc: 'The 3rd Joint Workshop on Recent Digital Twin and Production Logistics Research (DTPL) was held on October 20, 2024, at the University of Washington. Attendees: Dr. Bonggwon Kang, Mr. Bosung Kim, Prof. Soondo Hong, and Prof. Chiwoo Park. During the workshop, we had in-depth discussions on future collaborative plans related to digital twin calibration approach.' },
  { date: '2024.09', type: 'funding', img: '22.png',
    title: 'New Research Project Funded by Korea Research Foundation (’24.09–’27.08)',
    desc: 'I have commenced a new research project funded by the Korea Research Foundation under the Ministry of Education, with a ₩180 million research grant as the Principal Investigator. The project, titled "AI-integrated Simulation Optimization for Smart Storage/Retrieval Systems", will be conducted from September 2024 to August 2027. This funding will enable us to advance our research in AI-driven simulation optimization to enhance the efficiency of smart storage and retrieval systems.' },
  { date: '2024.08.11–16', type: 'collaboration', img: '21.jpg',
    title: 'The 2nd Joint Workshop on the Recent Digital Twin and Production Logistics Research at the University of Washington',
    desc: 'The 2nd Joint Workshop on Recent Digital Twin and Production Logistics Research (DTPL) was held from August 11 to 15, 2024, at the University of Washington. Attendees included Bonggwon Kang, Gwangheon Lee, Prof. Soondo Hong, and Prof. Chiwoo Park. During the workshop, we engaged in in-depth discussions on collaborative research related to digital twin-based decision-making in the warehouse and semiconductor industries. We would like to extend our special gratitude to Prof. Park for his significant efforts and time in organizing and inviting us to this event.' },
  { date: '2024.05.02–04', type: 'conference', img: '20.jpg',
    title: 'Presentation at the Spring KIIE Conference',
    desc: 'I gave a research presentation at the Spring KIIE Conference in Yeosu, South Korea. I introduced a surrogate-based optimization approach for yard template planning in a transshipment hub. The title is "Gaussian process-based yard template planning under vehicle congestion and container rehandling: a case study of Busan Port Terminal". This research addresses the difficulties when it comes to deal with simulation-based decision-making for a high-dimensional and combinatorial problem.' },
  { date: '2024.02.18–23', type: 'collaboration', img: '19.jpg',
    title: 'UW-PNU Joint Workshop at the University of Washington',
    desc: 'I and Professor Hong participated in the joint meeting on the recent digital twin research and simulation education at the University of Washington from February 18th to 23rd. We had a couple of meetings on the research topics such as the digital twin and its industry application. We\'d like to express gratitude to Professor Park for his effort for organizing this workshop.' },
  { date: '2024.01.31', type: 'conference', img: '18.jpg',
    title: 'Presentation at the Smart Manufacturing Forum for the SEMICON KOREA',
    desc: 'I gave an invited talk at the Smart Manufacturing Forum for the SEMICON KOREA in Seoul, South Korea. I delivered an introduction to simulation-based decision-making in large-scale material handling systems and a case study. It is such a big honor for me to be invited and present my research for this occasion.',
    url: 'https://www.semiconkorea.org/ko/node/9166' },
  // ── 2023 ────────────────────────────────────────────────────────────────
  { date: '2023.11.03', type: 'conference', img: '17.jpg',
    title: 'Presentation at the Semiconductor Smart Manufacturing Working Group',
    desc: 'I gave a presentation at the "Semiconductor Smart Manufacturing Working Group" during a planning session at the 2023 KIIE conference. The title of my talk was "Simulation-based optimization alternatives for large-scale material handling systems". I would like to express my gratitude to my professors Hong and Kim for their support. Furthermore, I\'d like to extend a special thanks to the audience for their constructive comments and attentive engagement throughout my presentation.' },
  { date: '2023.10.18', type: 'conference', img: '16.png',
    title: 'Presentation at the 2023 INFORMS Annual Meeting',
    desc: 'I gave an invited talk at the 2023 INFORMS Annual Meeting in Phoenix, AZ, USA. The title was "Surrogate model-based simulation optimization of vehicle positioning strategy in a semiconductor fab". I am deeply grateful to Professor Park, Professor Kim, and Professor Hong for their invaluable guidance and insightful feedback that significantly enhanced the quality of this research!' },
  { date: '2023.10', type: 'journal', img: '15.png',
    title: 'New paper has been accepted for publication in IEEE Access',
    desc: '"Simulation optimization of collaborative handshake operations for twin overhead shuttle cranes in a rail-based automated container terminal under demand uncertainty" has been accepted for publication in IEEE Access. Abstract) A handshake operation can mitigate workload imbalance and interference between twin transporters in a material handling system. Terminal operators in a rail-based automated container terminal can employ the handshake operation to twin overhead shuttle cranes (OSs) under maritime demand uncertainty. Since a handshake location is critical to collaboration performance, terminal operators often rely on simulation experiments with a manual iterative design to determine optimal handshake locations. However, the simulation optimization is still challenging when a simulation execution is computationally expensive. This study proposes a Bayesian optimization-based approach to expedite the decision-making process.',
    url: 'https://ieeexplore.ieee.org/document/10285297' },
  { date: '2023.09', type: 'journal', img: '14.png',
    title: 'New paper has been accepted for publication in IEEE Transactions on Automation Science and Engineering',
    desc: '"Bayesian optimization for the vehicle dwelling policy in a semiconductor wafer fab" has been accepted for publication in IEEE Transactions on Automation Science and Engineering. I have truly learned a lot from Professor Hong, Professor Park, and Professor Kim throughout the collaboration. Abstract) Many fabs prefer simulation-based decision making for vehicle dwelling policies because it can capture a fab\'s scalability and complexity. Vehicle dwelling policies assign idle vehicles to intra-bay and outer loops in automated material handling systems (AMHSs) to respond quickly to transportation demands. We propose a simulation optimization approach based on Bayesian optimization (BO) with class-based clustering. BO adaptively traces efficient vehicle dwelling policies based on a surrogate model and an acquisition function. Class-based clustering alleviates the high dimensionality of the design space by grouping bays into a small number of classes.',
    url: 'https://ieeexplore.ieee.org/document/10278155' },
  { date: '2023.09', type: 'journal', img: '13.png',
    title: 'New paper has been accepted for publication in Journal of the Korea Society for Simulation',
    desc: '"A Simulation-based Optimization for Scheduling in a Fab: Comparative Study on Different Sampling Methods" has been accepted in Journal of the Korea Society for Simulation. Abstract) A semiconductor fabrication facility (FAB) is one of the most capital-intensive and large-scale manufacturing systems that operate under complex and uncertain constraints through hundreds of fabrication steps. To improve fab performance with intuitive scheduling, practitioners have used weighted-sum scheduling. In this study, we investigated three sampling methods (i.e., Optimal Latin hypercube sampling (OLHS), Genetic algorithm (GA), and Decision-based sequential search (DSS)) for the optimization. Our simulation experiments demonstrate that: (1) three methods outperform greedy heuristics in performance metrics; (2) GA and DSS can be promising tools to accelerate the decision-making process.' },
  { date: '2023.09.07', type: 'conference', img: '12.jpg',
    title: 'Presentation at the 11th International Conference on Logistics and Maritime Systems',
    desc: 'I had a presentation at the 11th International Conference on Logistics and Maritime Systems, September 04–07, 2023, Busan, Korea. The title was "A case study of data-driven yard template planning with feature engineering". Abstract) Yard template planning in a container terminal aims to obtain the optimal assignment of yard storage for upcoming vessels with the minimum vessel turnaround time. We present data-driven yard template planning with feature engineering. Our simulation results revealed that: (1) the presented approach can outperform an analytical model under vehicle congestion; and (2) feature engineering significantly affects the optimization performance.' },
  { date: '2023.06.25', type: 'journal', img: '11.png',
    title: 'Active Learning of Piecewise Gaussian Process Surrogates — Preprint Available',
    desc: 'I participated in an international joint research and the preprint of our manuscript is now available. The research title is "Active Learning of Piecewise Gaussian Process Surrogates". It is such a big honor for me to join the collaborative research with Chiwoo Park, Robert Waelder, Benji Maruyama, Soondo Hong, and Robert Gramacy. Abstract) Active learning of Gaussian process (GP) surrogates has been useful for optimizing experimental designs for physical/computer simulation experiments. In this paper, we develop a method for active learning of piecewise, Jump GP surrogates. Jump GPs are continuous within, but discontinuous across, regions of a design space, as required for applications spanning autonomous materials design, configuration of smart factory systems, and many others. We demonstrate that additionally accounting for model bias is essential in the Jump GP context.' },
  { date: '2023.06.16', type: 'collaboration', img: '10.jpg',
    title: 'Surrogate model-based simulation optimization international joint research workshop',
    desc: 'Surrogate model-based simulation optimization international joint research workshop was held on June 16, 2023. Bonggwon Kang and Professor Soondo Hong attended the workshop. The invited participant included Professor Chiwoo Park from Florida State University. We discussed two ongoing studies and the direction of future studies for further improvements. I\'d like to express gratitude to professors for giving lots of effort in advising my research.' },
  { date: '2023.01.27', type: 'conference', img: '9.jpg',
    title: 'Presentation at Grand PNU Performance Exchange Programme',
    desc: 'I had a presentation at PNU Grand Performance Exchange Programme. My topic was "Simulation-based decision making in large-scale simulations". Since many manufacturing and material handling systems have enlarged the scales of factories and warehouses to achieve economies of scale, simulation has been widely used as a promising tool to diagnose and predict their decision making for upcoming demands. In this presentation, I shared my recent research progress and got comments from other graduate students.' },
  // ── 2022 ────────────────────────────────────────────────────────────────
  { date: '2022.10', type: 'conference', img: '8.png',
    title: 'Presentation at Winter Simulation Conference',
    desc: 'Winter Simulation Conference is one of the biggest conferences in Simulation. I had a presentation titled "Yard Template Planning in a Transshipment Hub: Gaussian Process Regression" for WSC 2022. The authors are Bonggwon Kang, Permata Vallentino Eko Joatiko, Jungtae Park, and Soondo Hong. Abstract) In this study, we propose an application of a Gaussian Process (GP) to predict the vessel turnaround time under the impacts of vehicle interruption and blocking. Based on the predictions, we determine the yard template with the shortest predicted vessel turnaround time among candidate yard templates. The simulation results show that the application reduces the vessel turnaround time by 6.66% compared with the baseline model.',
    url: 'https://ieeexplore.ieee.org/abstract/document/10015251' },
  { date: '2022.10', type: 'journal', img: '7.png',
    title: 'Paper publication in Journal of Korean Institute of Industrial Engineers',
    desc: '"A GA-based Optimization of a Weighted Lot Targeting Rule in a Semiconductor Wafer Fab" was published in Journal of the Korean Institute of Industrial Engineers. Abstract) Production scheduling in a semiconductor wafer fabrication (FAB) can be decomposed into two phases: lot targeting and lot dispatching. A weighted dispatching rule is a widely applied concept to obtain the production schedule in the FAB under its complex manufacturing factors. In this study, we investigate a weighted lot targeting rule considering the time-variant manufacturing factors, i.e., processing times, set-up operations, work-in-process levels, and transportation times for the bottleneck (photolithography) process. We propose a Genetic Algorithm (GA) to determine the efficient weights within a limited simulation run.',
    url: 'https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002887365' },
  { date: '2022.09', type: 'book', img: '6.png',
    title: 'Book chapter publication in Smart Manufacturing and Logistics Systems: Turning Ideas into Action',
    desc: '"Sequential optimization of a temporary storage location for cooperative twin overhead shuttles in a rail-based automated container terminal" was published in Smart Manufacturing and Logistics Systems: Turning Ideas into Action. Abstract) Twin overhead shuttle cranes (OSs) transport containers in a rail-based automated container terminal (RACT). Terminal operators separate a job into a main job and an auxiliary job based on a temporary storage location. This study proposes a sequential optimization approach, Bayesian optimization (BO), to determine the optimal temporary storage location within a limited simulation run. An experiment demonstrates that the BO predicts the outcomes of a RACT simulation and ensures a near-optimal solution within a limited simulation run.',
    url: 'https://link.springer.com/chapter/10.1007/978-3-031-16407-1_34' },
  { date: '2022.09', type: 'journal', img: '5.png',
    title: 'Paper publication in Journal of Korean Society of Industrial and Systems Engineering',
    desc: '"A Dynamic OHT Routing Algorithm in Automated Material Handling Systems" was published in Journal of Korean Society of Industrial and Systems Engineering. Abstract) An automated material handling system (AMHS) has been emerging as an important factor in the semiconductor wafer manufacturing industry. Unexpected vehicle congestion increases the delivery time and deteriorates the Fab\'s production efficiency. In this study, we propose a Q-Learning based dynamic routing algorithm considering vehicle congestion to reduce the delivery time. Through simulation experiments, we confirm that the proposed algorithm finds an efficient path for the vehicles compared to benchmark algorithms with a reduced mean and decreased standard deviation of the delivery time in the Fab\'s AMHS.',
    url: 'https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002881508' },
  { date: '2022.06', type: 'journal', img: '4.png',
    title: 'Paper publication in Korea Journal of BigData',
    desc: '"A Study of a Video-based Simulation Input Modeling Procedure in a Construction Equipment Assembly Line" was published in Korea Journal of BigData. Abstract) A simulation technique can be used to analyze performance measures and support decision makings in manufacturing systems considering operational uncertainty and complexity. However, data collection to build a simulation is quite limited when a target system includes manual productions with a lot of operational time such as construction equipment assembly lines. This study proposes a procedure for simulation input modeling using video data when it is difficult to collect enough input data to fit a probability distribution.',
    url: 'https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002855671' },
  { date: '2022.06', type: 'journal', img: '3.png',
    title: 'Paper publication in Korea Journal of BigData',
    desc: '"A Simulation-based Genetic Algorithm for a Dispatching Rule in a Flexible Flow Shop with Rework Process" was published in Korea Journal of BigData. Abstract) This study investigates a dynamic flexible flow shop scheduling problem under uncertain rework operations for an automobile pipe production line. We propose a weighted dispatching rule (WDR) based on the multiple dispatching rules to minimize the weighted sum of average flowtime and tardiness. The simulation experiments demonstrate that WDR outperforms the baseline dispatching rules in average flowtime and tardiness.',
    url: 'https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002855661' },
  // ── 2021 / 2020 ──────────────────────────────────────────────────────────
  { date: '2021.08', type: 'journal', img: '2.png',
    title: 'A paper publication in IEEE Access',
    desc: '"A Job Sequencing Problem of an Overhead Shuttle Crane in a Rail-Based Automated Container Terminal" was published in IEEE Access. I\'m one of the co-first authors. I suggested a two-phase genetic algorithm and conducted simulation experiments with polishing the manuscript. Abstract) This study proposes a job scheduling model and its heuristics for an automated container terminal with an overhead shuttle crane (OS) to reduce the total tardiness time of flatcars and external trucks by considering the separation of each job into a main job, and a premarshaling or remarshaling job. We present a two-stage genetic algorithm (TGA) based on two local improvement procedures: an iterative local search procedure and an opportunistic job separation procedure.',
    url: 'https://ieeexplore.ieee.org/abstract/document/9174991' },
  { date: '2020.04', type: 'book', img: '1.png',
    title: 'Book chapter publication in Dynamics in Logistics',
    desc: '"A Simulation Study of a Storage Policy for a Container Terminal" was published in Dynamics in Logistics. Abstract) This paper proposes a storage policy for container terminals that handle large numbers of vessels and containers. The storage policy considers the estimated workload at a certain area in a given period; the partition of a storage block into subblocks; the proximities between containers belonging to the same group; the segregation between different groups of containers; and the stack heights of containers. The preliminary result shows that the container terminal operates more efficiently under the storage policy with a bay as a subblock setting.',
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

function renderDesc(desc) {
  if (!desc) return null
  const marker = 'Abstract)'
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
        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Abstract</span>
        <p className="text-sm text-gray-300 leading-relaxed mt-2">{after}</p>
      </div>
    </>
  )
}

function NewsModal({ item, onClose }) {
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
              alt={item.title}
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
                {item.type}
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

          <h2 className="font-bold text-white text-base leading-snug mb-4">{item.title}</h2>

          {renderDesc(item.desc)}

          {item.url && (
            <div className="mt-5">
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white text-sm font-semibold transition-colors"
              >
                Visit Link
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
            alt={item.title}
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
            {item.type}
          </span>
          <span className="text-xs text-gray-500">{item.date}</span>
        </div>

        <p className="font-semibold text-gray-100 text-sm leading-snug flex-1">{item.title}</p>

        <p className="text-xs text-gray-600 mt-3">Click to read more →</p>
      </div>
    </motion.div>
  )
}

function PageHeader() {
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
            News
          </motion.h1>
        </motion.div>
      </div>
    </section>
  )
}

export default function NewsPage() {
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
              All
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
                {k}
              </button>
            ))}
          </div>

          {/* Year sections with card grids */}
          <div key={activeFilter} className="space-y-16">
            {years.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-12">No items for this filter.</p>
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
                    {grouped[year].length} item{grouped[year].length > 1 ? 's' : ''}
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
