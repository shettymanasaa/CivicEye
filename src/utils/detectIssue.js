import * as tmImage from '@teachablemachine/image'

const URL = 'https://teachablemachine.withgoogle.com/models/fTZs4RXAS/'

let model = null

async function loadModel() {
  if (!model) {
    model = await tmImage.load(
      URL + 'model.json',
      URL + 'metadata.json'
    )
  }
  return model
}

export async function detectIssue(imageUrl) {
  try {
    const model = await loadModel()

    const img = document.createElement('img')
    img.src = imageUrl

    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
    })

    const predictions = await model.predict(img)

   console.log("Predictions:", predictions)

const pothole =
  predictions.find(p =>
    p.className.toLowerCase() === "pothole"
  )?.probability || 0

const garbage =
  predictions.find(p =>
    p.className.toLowerCase() === "garbage"
  )?.probability || 0

const normal =
  predictions.find(p =>
    p.className.toLowerCase() === "normal"
  )?.probability || 0

const potholePercent = Math.round(pothole * 100)
const garbagePercent = Math.round(garbage * 100)
const normalPercent = Math.round(normal * 100)

if (normalPercent > 70) {
  return {
    noComplaint: true,
    issueTypes: [],
    severity: "none",
    confidence: normalPercent,
    potholePercent,
    garbagePercent,
    normalPercent
  }
}

let issueType =
  potholePercent > garbagePercent
    ? "pothole"
    : "garbage"

const confidence =
  Math.max(potholePercent, garbagePercent)

let severity = "low"

if(confidence>=85)
  severity="very high"
else if (confidence >=60)
  severity = "high"
else if (confidence >=40)
  severity = "medium"

return {
  issueTypes: [issueType],
  severity,
  confidence,
  potholePercent,
  garbagePercent,
  normalPercent,
  priority:
  
    severity==="very high"
      ? 10
    :severity === "high"
      ? 8
      : severity === "medium"
      ? 5
      : 2,
  department:
    issueType === "pothole"
      ? "roads"
      : "sanitation",
}
  } catch (err) {
  console.error(err)

  return {
    issueTypes: ["garbage"],
    severity: "medium",
    confidence: 0,
    potholePercent: 0,
    garbagePercent: 0,
    normalPercent: 0,
    priority: 5,
    department: "sanitation"
  }
}
}